const { Group } = require("../models/group");
const config = require("../../config.json");

const listGroups = (module.exports.list = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "listGroups",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.persons.find(
			(person) => person._id == personId
		)
	) {
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
		auth,
		body: { group: newGroup },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "createGroup",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin || auth.groups.find((group) => group._id == groupId)) {
	} else {
		return res.send({
			error: {
				name: "createGroup",
				message: "Unauthorized",
			},
		});
	}
});

const readGroup = (module.exports.read = (req, res, next) => {
	const {
		auth,
		params: { groupId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "readGroup",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin || auth.groups.find((group) => group._id == groupId)) {
	} else {
		return res.send({
			error: {
				name: "readGroup",
				message: "Unauthorized",
			},
		});
	}
});

const updateGroup = (module.exports.update = (req, res, next) => {
	const {
		auth,
		params: { groupId },
		body: { group: newGroup },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "updateGroup",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin || auth.groups.find((group) => group._id == groupId)) {
	} else {
		return res.send({
			error: {
				name: "updateGroup",
				message: "Unauthorized",
			},
		});
	}
});

const deleteGroup = (module.exports.delete = (req, res, next) => {
	const {
		auth,
		params: { groupId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "deleteGroup",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin || auth.groups.find((group) => group._id == groupId)) {
	} else {
		return res.send({
			error: {
				name: "deleteGroup",
				message: "Unauthorized",
			},
		});
	}
});
