const {
	Parser,
	transforms: { unwind },
} = require("json2csv");
const {
	Types: { ObjectId },
} = require("mongoose");

const { Group } = require("../models/group");
const { CheckIn } = require("../models/checkin");
const mail = require("../mail");
const config = require("../../config.json");
const { user } = require("../../server/routes");

const listGroups = (module.exports.list = (req, res, next) => {
	const {
		auth,
		query: { format },
	} = req;
	// Check for authorization first
	if (auth && auth.isAdmin) {
		Group.find()
			.lean()
			.exec((error, groups) => {
				if (error)
					return res.send({
						error: {
							name: "listGroups",
							...error,
						},
					});
				switch (format) {
					case "csv":
						const parser = new Parser({
							fields: [
								"_id",
								"phone",
								"email",
								"name",
								"people.name",
								"people.birthdate",
							],
							transforms: [unwind({ paths: ["people"] })],
						});
						const csvGroups = parser.parse(groups);
						return res.send(csvGroups);
						break;
					default:
						return res.send(groups);
						break;
				}
			});
	} else {
		return res.send({
			error: {
				name: "listGroups",
				message: "Unauthorized",
			},
		});
	}
});

const createGroup = (module.exports.create = (req, res, next) => {
	const {
		body: { group: newGroup, people },
	} = req;
	if (!newGroup || !newGroup.phone || !newGroup.email || !newGroup.pin || !newGroup.name)
		return res.send({
			error: {
				name: "createGroup",
				message: "Valid group not provided.",
			},
		});
	const group = new Group(newGroup);
	group.save((error, group) => {
		if (error)
			return res.send({
				error: {
					name: "createGroup",
					...error,
				},
			});
		mail.createGroup(group.toObject(), (error) => {
			if (error) {
				group.delete(() => {
					return res.send({
						error: {
							name: "createGroup",
							...error,
						},
					});
				});
			} else {
				return res.send(group);
			}
		});
	});
});

const readGroup = (module.exports.read = (req, res, next) => {
	const {
		params: { groupId },
		query: { phone, pin },
	} = req;
	if (!pin)
		return res.send({
			error: {
				name: "readGroup",
				message: "Unauthorized",
			},
		});
	const where = phone ? { phone, pin } : { _id: groupId, pin };
	Group.findOne(where)
		.lean()
		.exec((error, group) => {
			if (error)
				return res.send({
					error: {
						name: "readGroup",
						...error,
					},
				});
			if (!group)
				return res.send({
					error: "readGroup",
					message: "Group not found.",
				});
			CheckIn.find({
				"person._id": { $in: group.people.map((person) => person._id) },
				exit: { $exists: false },
			})
				.lean()
				.exec((error, checkins) => {
					group.people = group.people.map((person) => {
						const checkin = checkins.find(
							(checkin) => checkin.person._id.toString() == person._id.toString()
						);
						person.checkin = checkin ? checkin : null;
						return person;
					});
					return res.send(group);
				});
		});
});

const updateGroup = (module.exports.update = (req, res, next) => {
	const {
		auth,
		params: { groupId },
		query: { pin },
		body: { group: newGroup },
	} = req;
	// Check for authorization first
	if (!pin)
		return res.send({
			error: {
				name: "updateGroup",
				message: "Unauthorized",
			},
		});
	newGroup.people = newGroup.people.map((person) => ({ ...person, _id: ObjectId(person._id) }));
	Group.findOneAndUpdate({ _id: groupId, pin }, newGroup, { new: true })
		.lean()
		.exec((error, group) => {
			if (error)
				return res.send({
					error: {
						name: "updateGroup",
						...error,
					},
				});
			if (!group)
				return res.send({
					error: {
						name: "updateGroup",
						message: "Group not found.",
					},
				});

			CheckIn.find({
				"person._id": { $in: group.people.map((person) => person._id) },
				exit: { $exists: false },
			})
				.lean()
				.exec((error, checkins) => {
					group.people = group.people.map((person) => {
						const checkin = checkins.find(
							(checkin) => checkin.person._id.toString() == person._id.toString()
						);
						person.checkin = checkin ? checkin : null;
						return person;
					});
					mail.updateGroup(group, (error) => {
						if (error) {
							return res.send({
								error: {
									name: "updateGroup",
									...error,
								},
							});
						} else {
							return res.send(group);
						}
					});
				});
		});
});

const deleteGroup = (module.exports.delete = (req, res, next) => {
	const {
		auth,
		params: { groupId },
		query: { pin },
	} = req;
	// Check for authorization first
	if (!pin)
		return res.send({
			error: {
				name: "deleteGroup",
				message: "Unauthorized",
			},
		});
	Group.findOneAndDelete({ _id: groupId, pin })
		.lean()
		.exec((error, group) => {
			if (error)
				return res.send({
					error: {
						name: "deleteGroup",
						...error,
					},
				});
			if (!group)
				return res.send({
					error: "deleteGroup",
					message: "Group not found.",
				});
			mail.deleteGroup(group, (error) => {
				if (error)
					return res.send({
						error: {
							name: "deleteGroup",
							...error,
						},
					});
				return res.send(group);
			});
		});
});

const resetPIN = (module.exports.resetPIN = (req, res, next) => {
	const {
		query: { phone },
	} = req;
	// Generate the message
	Group.findOne({ phone }).exec((error, group) => {
		if (error)
			return res.send({
				error: {
					name: "resetPIN",
					...error,
				},
			});
		// Make sure there's actually a user that matches
		if (!group)
			return res.send({
				error: {
					name: "resetPIN",
					message: `Password reset not available for ${phone}`,
				},
			});
		const randomInt = (max) => {
			return Math.floor(Math.random() * Math.floor(9));
		};
		if (!group.email)
			return res.send({
				error: {
					name: "resetPIN",
					message: `No email address.`,
				},
			});
		group.pin = `${randomInt(9)}${randomInt(9)}${randomInt(9)}${randomInt(9)}`;
		group.save((error) => {
			if (error)
				return res.send({
					error: {
						name: "resetPIN",
						...error,
					},
				});
			mail.resetPIN({ ...group.toObject() }, (error, body) => {
				// Make sure there's actually a user that matches
				if (error)
					return res.send({
						error: {
							name: "resetPIN",
							...error,
						},
					});
				return res.send({
					complete: {
						name: "resetPIN",
						message: `An email reset link has been sent to ${group.email}.`,
					},
				});
			});
		});
	});
});
