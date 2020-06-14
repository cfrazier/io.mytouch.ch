const {
	Types: { ObjectId },
} = require("mongoose");
const { Venue } = require("../models/venue");
const { CheckIn } = require("../models/checkin");

const config = require("../../config.json");

const listVenues = (module.exports.list = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "listVenues",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find(
			(organization) => organization._id == organizationId
		)
	) {
		Venue.find({ organizationId, active: true })
			.lean()
			.select("-events")
			.exec((error, venues) => {
				if (error)
					return res.send({
						error: {
							name: "listVenues",
							message: error,
						},
					});
				return res.send(venues);
			});
	} else {
		return res.send({
			error: {
				name: "listVenues",
				message: "Unauthorized",
			},
		});
	}
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
		auth.organizations.find(
			(organization) => organization._id == organizationId
		)
	) {
		const venue = new Venue(newVenue);
		venue.organizationId = ObjectId(organizationId);
		venue.save((error) => {
			if (error)
				return res.send({
					error: {
						name: "createVenue",
						message: error,
					},
				});
			return res.send(venue);
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
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "readVenue",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find(
			(organization) => organization._id == organizationId
		)
	) {
		Venue.findOne({ organizationId, _id: venueId, active: true })
			.lean()
			.select("-events")
			.exec((error, venue) => {
				if (error)
					return res.send({
						error: {
							name: "readVenue",
							message: error,
						},
					});
				if (!venue)
					return res.send({
						error: {
							name: "readVenue",
							message: "Venue not found.",
						},
					});
				return res.send(venue);
			});
	} else {
		return res.send({
			error: {
				name: "readVenue",
				message: "Unauthorized",
			},
		});
	}
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
		auth.organizations.find(
			(organization) => organization._id == organizationId
		)
	) {
		Venue.findOneAndUpdate({ _id: venueId, organizationId }, newVenue, {
			new: true,
		})
			.lean()
			.select("-events")
			.exec((error, venue) => {
				if (error)
					return res.send({
						error: {
							name: "createVenue",
							message: error,
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
		auth.organizations.find(
			(organization) => organization._id == organizationId
		)
	) {
		Venue.findOneAndUpdate(
			{ _id: venueId, organizationId },
			{ active: false },
			{ new: true }
		)
			.lean()
			.select("-events")
			.exec((error, venue) => {
				if (error)
					return res.send({
						error: {
							name: "deleteVenue",
							message: error,
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

const clearVenueCheckIns = (module.exports.clearVenueCheckIns = (
	req,
	res,
	next
) => {
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
		auth.organizations.find(
			(organization) => organization._id == organizationId
		)
	) {
		CheckIn.updateMany(
			{ venueId, exit: { $exists: false } },
			{ exit: Date.now() }
		)
			.countDocuments()
			.exec((error, count) => {
				if (error)
					return res.send({
						error: {
							name: "clearVenueCheckIns",
							message: error,
						},
					});
				return res.send({
					venueId,
					count,
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
