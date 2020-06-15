const {
	Parser,
	transforms: { unwind },
} = require("json2csv");

const { Group } = require("../models/group");
const { Person } = require("../models/person");
const mail = require("../mail");
const config = require("../../config.json");

const listGroups = (module.exports.list = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
		query: { format },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "listGroups",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin) {
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
							fields: ["_id", "phone", "email", "name", "people.name", "people.birthdate"],
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
	if (
		!newGroup ||
		!newGroup.phone ||
		!newGroup.email ||
		!newGroup.pin ||
		!newGroup.name
	)
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
		query: { pin },
	} = req;
	if (!pin)
		return res.send({
			error: {
				name: "readGroup",
				message: "Unauthorized",
			},
		});
	Group.findOne({ _id: groupId, pin })
		.select("-pin")
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
			return res.send(group);
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
			mail.updateGroup(group, (error) => {
				if (error) {
					group.delete(() => {
						return res.send({
							error: {
								name: "updateGroup",
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
