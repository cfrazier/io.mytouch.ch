const mongoose = require("mongoose");
const { Organization } = require("../models/organization");
const config = require("../../config.json");

const listOrganizations = (module.exports.list = (req, res, next) => {
	const { auth } = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "listOrganizations",
				message: "Unauthorized",
			},
		});
	const where = auth.isAdmin
		? { active: true }
		: { active: true, users: mongoose.Types.ObjectId(auth._id) };
	Organization.find(where)
		.lean()
		.exec((error, organizations) => {
			if (error)
				return res.send({
					error: {
						name: "listOrganizations",
						...error,
					},
				});
			if (!organizations)
				return res.send({
					error: {
						name: "listOrganizations",
						message: "No organizations found.",
					},
				});
			return res.send(organizations);
		});
});

const createOrganization = (module.exports.create = (req, res, next) => {
	const {
		auth,
		body: { organization: newOrganization },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "createOrganization",
				message: "Unauthorized",
			},
		});
	newOrganization.active = true;
	const organization = new Organization(newOrganization);
	organization.users.push(auth._id);
	if (!newOrganization.colors) organization.colors = config.colors;
	organization.save((error) => {
		if (error)
			return res.send({
				error: {
					name: "createOrganization",
					...error,
				},
			});
		return res.send(organization);
	});
});

const readOrganization = (module.exports.read = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "readOrganization",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find((organization) => organization._id == organizationId)
	) {
		Organization.findOne({ _id: organizationId, active: true })
			.lean()
			.exec((error, organization) => {
				if (error)
					return res.send({
						error: {
							name: "readOrganization",
							...error,
						},
					});
				if (!organization)
					return res.send({
						error: {
							name: "readOrganization",
							message: "Organization not found.",
						},
					});
				return res.send(organization);
			});
	} else {
		return res.send({
			error: {
				name: "readOrganization",
				message: "Unauthorized",
			},
		});
	}
});

const updateOrganization = (module.exports.update = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
		body: { organization: newOrganization },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "updateOrganization",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find((organization) => organization._id == organizationId)
	) {
		Organization.findByIdAndUpdate(organizationId, newOrganization, {
			new: true,
		})
			.lean()
			.exec((error, organization) => {
				if (error)
					return res.send({
						error: {
							name: "updateOrganization",
							...error,
						},
					});
				if (!organization)
					return res.send({
						error: {
							name: "updateOrganization",
							message: "Organization not found.",
						},
					});
				return res.send(organization);
			});
	} else {
		return res.send({
			error: {
				name: "updateOrganization",
				message: "Unauthorized",
			},
		});
	}
});

const deleteOrganization = (module.exports.delete = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "deleteOrganization",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find((organization) => organization._id == organizationId)
	) {
		Organization.findByIdAndUpdate(organizationId, { active: false }, { new: true })
			.lean()
			.exec((error, organization) => {
				if (error)
					return res.send({
						error: {
							name: "deleteOrganization",
							...error,
						},
					});
				if (!organization)
					return res.send({
						error: {
							name: "deleteOrganization",
							message: "Organization not found.",
						},
					});
				return res.send(organization);
			});
	} else {
		return res.send({
			error: {
				name: "deleteOrganization",
				message: "Unauthorized",
			},
		});
	}
});
