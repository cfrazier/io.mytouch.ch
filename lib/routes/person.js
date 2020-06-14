const mongoose = require("mongoose");
const { Person } = require("../models/person");
const config = require("../../config.json");

const listPeople = (module.exports.list = (req, res, next) => {
	const { auth } = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "listPeople",
				message: "Unauthorized",
			},
		});
	const where = auth.isAdmin
		? { active: true }
		: { active: true, users: mongoose.Types.ObjectId(auth._id) };
	Person.find(where)
		.lean()
		.exec((error, people) => {
			if (error)
				return res.send({
					error: {
						name: "listPeople",
						message: error,
					},
				});
			if (!people)
				return res.send({
					error: {
						name: "listPeople",
						message: "No people found.",
					},
				});
			return res.send([...people]);
		});
});

const createPerson = (module.exports.create = (req, res, next) => {
	const {
		auth,
		body: { person: newPerson },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "createPerson",
				message: "Unauthorized",
			},
		});
	const person = new Person(newPerson);
	person.save((error) => {
		if (error)
			return res.send({
				error: {
					name: "createPerson",
					message: error,
				},
			});
		return res.send({ ...person });
	});
});

const readPerson = (module.exports.read = (req, res, next) => {
	const {
		auth,
		query: { pin },
		params: { groupId, personId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "readPerson",
				message: "Unauthorized",
			},
		});
	const where = auth.isAdmin
		? { _id: personId, active: true }
		: { _id: personId, active: true };
	Person.findOne(where)
		.lean()
		.exec((error, person) => {
			if (error)
				return res.send({
					error: {
						name: "readPerson",
						message: error,
					},
				});
			if (!person)
				return res.send({
					error: {
						name: "readPerson",
						message: "Person not found.",
					},
				});
			return res.send({ ...person });
		});
});

const updatePerson = (module.exports.update = (req, res, next) => {
	const {
		auth,
		params: { personId },
		body: { person: newPerson },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "updatePerson",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin || auth.people.find((person) => person._id == personId)) {
		Person.findByIdAndUpdate(personId, newPerson, {
			new: true,
		})
			.lean()
			.exec((error, person) => {
				if (error)
					return res.send({
						error: {
							name: "updatePerson",
							message: error,
						},
					});
				if (!person)
					return res.send({
						error: {
							name: "updatePerson",
							message: "Person not found.",
						},
					});
				return res.send({ ...person });
			});
	} else {
		return res.send({
			error: {
				name: "updatePerson",
				message: "Unauthorized",
			},
		});
	}
});

const deletePerson = (module.exports.delete = (req, res, next) => {
	const {
		auth,
		params: { personId },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "deletePerson",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin || auth.people.find((person) => person._id == personId)) {
		Person.findByIdAndUpdate(personId, { active: false }, { new: true })
			.lean()
			.exec((error, person) => {
				if (error)
					return res.send({
						error: {
							name: "deletePerson",
							message: error,
						},
					});
				if (!person)
					return res.send({
						error: {
							name: "deletePerson",
							message: "Person not found.",
						},
					});
				return res.send({ ...person });
			});
	} else {
		return res.send({
			error: {
				name: "deletePerson",
				message: "Unauthorized",
			},
		});
	}
});
