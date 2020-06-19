const crypto = require("crypto");
const { Parser } = require("json2csv");
const {
	Types: { ObjectId },
} = require("mongoose");

const { CheckIn } = require("../models/checkin");
const { Group } = require("../models/group");
const { Organization } = require("../models/organization");
const { Venue } = require("../models/venue");

const config = require("../../config.json");

const getAvailable = async (venueId) => {
	try {
		const venue = await Venue.findById(venueId);
		try {
			const count = await CheckIn.find({
				"venue._id": ObjectId(venueId),
				exit: { $exists: false },
			}).countDocuments();
			return venue.toObject().capacity - count;
		} catch (error) {
			console.log(error);
			return error;
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

const listVenues = (module.exports.list = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
	} = req;
	// Check for authorization first
	Venue.find({ organizationId, active: true })
		.lean()
		.exec(async (error, venues) => {
			if (error)
				return res.send({
					error: {
						name: "listVenues",
						...error,
					},
				});
			if (!venues)
				return res.send({
					error: {
						name: "listVenues",
						message: "Venues not found.",
					},
				});
			for (i = 0; i < venues.length; i++) {
				venues[i].available = await getAvailable(venues[i]._id);
			}
			return res.send(venues);
		});
});

const createVenue = (module.exports.create = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
		body: { venue: newVenue },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "createVenue",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find((organization) => organization._id == organizationId)
	) {
		Organization.findById(organizationId, (error, organization) => {
			if (error)
				return res.send({
					error: {
						name: "createVenue",
						...error,
					},
				});
			if (!organization)
				return res.send({
					error: {
						name: "createVenue",
						message: "Organization not found.",
					},
				});
			newVenue.code = crypto
				.createHash("md5")
				.update(Date.now().toString())
				.digest("hex")
				.substring(0, 5);
			const venue = new Venue(newVenue);
			venue.color =
				organization.colors[
					Math.floor(Math.random() * Math.floor(organization.colors.length))
				];
			venue.organizationId = ObjectId(organizationId);
			venue.save((error) => {
				if (error)
					return res.send({
						error: {
							name: "createVenue",
							...error,
						},
					});
				return res.send(venue);
			});
		});
	} else {
		return res.send({
			error: {
				name: "createVenue",
				message: "Unauthorized",
			},
		});
	}
});

const readVenue = (module.exports.read = (req, res, next) => {
	const {
		auth,
		params: { organizationId, venueId },
	} = req;
	Venue.findOne({ organizationId, _id: venueId, active: true })
		.lean()
		.exec(async (error, venue) => {
			if (error)
				return res.send({
					error: {
						name: "readVenue",
						...error,
					},
				});
			if (!venue)
				return res.send({
					error: {
						name: "readVenue",
						message: "Venue not found.",
					},
				});
			venue.available = await getAvailable(venue._id);
			console.log(venue.available);
			return res.send(venue);
		});
});

const readVenueSimple = (module.exports.readSimple = (req, res, next) => {
	const {
		query: { code },
	} = req;
	Venue.findOne({ code, active: true })
		.lean()
		.exec((error, venue) => {
			if (error)
				return res.send({
					error: {
						name: "readVenueSimple",
						...error,
					},
				});
			if (!venue)
				return res.send({
					error: {
						name: "readVenueSimple",
						message: "Venue not found.",
					},
				});
			Organization.findOne({ _id: venue.organizationId, active: true })
				.lean()
				.select("-users")
				.exec(async (error, organization) => {
					if (error)
						return res.send({
							error: {
								name: "readVenueSimple",
								...error,
							},
						});
					if (!organization)
						return res.send({
							error: {
								name: "readVenueSimple",
								message: "Organization not found.",
							},
						});
					venue.organization = organization;
					venue.available = await getAvailable(venue._id);
					return res.send(venue);
				});
		});
});

const updateVenue = (module.exports.update = (req, res, next) => {
	const {
		auth,
		params: { organizationId, venueId },
		body: { venue: newVenue },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "updateVenue",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find((organization) => organization._id == organizationId)
	) {
		Venue.findOneAndUpdate({ _id: venueId, organizationId }, newVenue, {
			new: true,
		})
			.lean()
			.exec((error, venue) => {
				if (error)
					return res.send({
						error: {
							name: "createVenue",
							...error,
						},
					});
				return res.send(venue);
			});
	} else {
		return res.send({
			error: {
				name: "updateVenue",
				message: "Unauthorized",
			},
		});
	}
});

const deleteVenue = (module.exports.delete = (req, res, next) => {
	const {
		auth,
		params: { organizationId, venueId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "deleteVenue",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find((organization) => organization._id == organizationId)
	) {
		Venue.findOneAndUpdate(
			{ _id: venueId, organizationId, active: true },
			{ active: false },
			{ new: true }
		)
			.lean()
			.exec((error, venue) => {
				if (error)
					return res.send({
						error: {
							name: "deleteVenue",
							...error,
						},
					});
				if (!venue)
					return res.send({
						error: {
							name: "deleteVenue",
							message: "Venue not found.",
						},
					});
				return res.send(venue);
			});
	} else {
		return res.send({
			error: {
				name: "deleteVenue",
				message: "Unauthorized",
			},
		});
	}
});

const createCheckIn = (module.exports.createCheckIn = (req, res, next) => {
	const {
		body: { venueCode, groupId, personId }, // personId needs to be an array
	} = req;
	// Get the group
	Group.findById(groupId)
		.lean()
		.exec((error, group) => {
			if (error)
				return res.send({
					error: { name: "createCheckIn", ...error },
				});
			if (!group)
				res.send({
					error: {
						name: "createCheckIn",
						message: "Group not found.",
					},
				});
			// Next find the person in the group
			const people = group.people.filter((person) => {
				return personId.includes(person._id.toString());
			});
			if (people.length == 0)
				res.send({
					error: {
						name: "createCheckIn",
						message: "Person not found.",
					},
				});
			// Finally, find the venue
			Venue.findOne({ code: venueCode }, async (error, venue) => {
				if (error)
					return res.send({
						error: { name: "createCheckIn", ...error },
					});

				if (!venue)
					return res.send({
						error: {
							name: "createCheckIn",
							message: "Venue not found.",
						},
					});

				const available = await getAvailable(venue._id);

				if (people.length > available)
					return res.send({
						error: {
							name: "createCheckIn",
							message: "Venue full.",
						},
					});

				for (i = 0; i < people.length; i++) {
					const person = people[i];
					const oldCheckIn = await CheckIn.findOne({
						"person._id": ObjectId(person._id),
						exit: { $exists: false },
					});
					if (!oldCheckIn) {
						const checkin = new CheckIn({
							venue,
							group,
							person,
							enter: Date.now(),
						});
						await checkin.save();
					}
				}

				const checkins = await CheckIn.find({
					"group._id": ObjectId(groupId),
					exit: { $exists: false },
				});

				group.people = group.people.map((person) => {
					const checkin = checkins.find((checkin) => {
						return checkin.person._id.toString() === person._id.toString();
					});
					person.checkin = checkin ? checkin.toObject() : null;
					return person;
				});

				return res.send(group);
			});
		});
});

const listCheckIns = (module.exports.listCheckIns = (req, res, next) => {
	const {
		auth,
		params: { organizationId, venueId },
		query: { format },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "listCheckIns",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find((organization) => organization._id == organizationId)
	) {
		CheckIn.find({ "venue._id": ObjectId(venueId) })
			.lean()
			.exec((error, checkins) => {
				if (error)
					return res.send({
						error: {
							name: "listCheckIns",
							...error,
						},
					});
				switch (format) {
					case "csv":
						const parser = new Parser({
							fields: [
								"venue._id",
								"venue.name",
								"group._id",
								"group.name",
								"group.phone",
								"group.email",
								"person.name",
								"person.birthdate",
								"enter",
								"exit",
							],
						});
						const csvCheckIns = parser.parse(checkins);
						return res.send(csvCheckIns);
						break;
					default:
						res.send(checkins);
						break;
				}
			});
	} else {
		return res.send({
			error: {
				name: "deleteVenue",
				message: "Unauthorized",
			},
		});
	}
});

const clearVenueCheckIns = (module.exports.clearVenueCheckIns = (req, res, next) => {
	const {
		auth,
		params: { organizationId, venueId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "clearVenueCheckIns",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find((organization) => organization._id == organizationId)
	) {
		CheckIn.updateMany(
			{ "venue._id": ObjectId(venueId), exit: { $exists: false } },
			{ exit: Date.now() }
		).exec((error, result) => {
			if (error)
				return res.send({
					error: {
						name: "clearVenueCheckIns",
						...error,
					},
				});
			return res.send({
				venueId,
				...result,
			});
		});
	} else {
		return res.send({
			error: {
				name: "clearVenueCheckIns",
				message: "Unauthorized",
			},
		});
	}
});
