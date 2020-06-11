// Libraries
const bcrypt = require("bcrypt");
const mail = require("../mail");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { Organization } = require("../models/organization");

// Constants
const {
	Schema,
	Types: { ObjectId },
} = mongoose;
const config = require("../../config.json");

const authenticate = (exports.authenticate = (req, res, next) => {
	const token = req.cookies.token ? req.cookies.token : req.query.token;
	const { email, password } = req.query;
	// Check to see if the user is actually attempting a log in
	if (email && password) {
		// Attempt to find the user
		User.findUser(email, password, (error, user) => {
			if (error) {
				res.clearCookie("token");
				return res.send({
					error: {
						name: "authorizeUser",
						message: error,
					},
				});
			}
			if (user) {
				// Convert the user collection to an object
				var payload = user.toObject();
				// Remove anything potentially private
				delete payload.password;
				delete payload.__v;
				// Grab the user's organizations
				Organization.find({ users: { _id: user._id } })
					.lean()
					.exec((error, organizations) => {
						if (error) {
							res.clearCookie("token");
							return res.send({
								error: {
									name: "authorizeUser",
									message: error,
								},
							});
						}
						// Add organizations to payload
						payload.organizations = organizations;
						// Generate a JWT token
						const token = jwt.sign(payload, config.jwt.secret, {
							expiresIn: config.jwt.exp,
						});
						// Send the resulting token
						res.cookie("token", token);
						// Set up the request objects
						req.auth = payload;
						// We can continue on to whatever else we were doing
						next();
					});
			} else {
				res.clearCookie("token");
				res.send({
					error: {
						name: "authorizeUser",
						message: "User not found.",
					},
				});
				next();
			}
		});
	} else if (token) {
		// Not logging in, so check the token
		jwt.verify(token, config.jwt.secret, (error, decoded) => {
			if (error) {
				// The token was bad, so we might as well completely invalidate it
				res.clearCookie("token");
				req.auth = undefined;
				next();
			} else {
				// Send the resulting token
				if (!req.cookies.token) res.cookie("token", token);
				req.auth = decoded;
				next();
			}
		});
	} else {
		// Nothing really was done. Let's just clean up.
		res.clearCookie("token");
		req.auth = undefined;
		next();
	}
});

const createUser = (module.exports.create = (req, res, next) => {
	const {
		auth,
		params: { organizationId },
		body: { user: updateUser },
	} = req;
	// Check for authorization first
	if (!auth)
		return res.send({
			error: {
				name: "createUser",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find(
			(organization) => organization._id == organizationId
		)
	) {
		mongoose
			.model("Organization")
			.findOne({ _id: organizationId }, (error, organization) => {
				// Return an error if found
				if (error)
					return res.send({
						error: {
							name: "createUser",
							message: error,
						},
					});

				// Make sure the organization actually exists
				if (!organization)
					return res.send({
						error: {
							name: "createUser",
							message: "Invalid organization ID",
						},
					});

				const user = new User(updateUser);
				user.save((error) => {
					// Return an error if found
					if (error)
						return res.send({
							error: {
								name: "createUser",
								message: error,
							},
						});
					// Add the user to the organization
					organization.users.push(user._id);
					// Save everything
					organization.save((error) => {
						// Return an error if found
						if (error)
							return res.send({
								error: {
									name: "createUser",
									message: error,
								},
							});
						// Return the user record
						return res.send({ user });
					});
				});
			});
	} else {
		return res.send({
			error: {
				name: "createUser",
				message: "Unauthorized",
			},
		});
	}
});

const readUser = (module.exports.read = (req, res, next) => {
	const {
		auth,
		params: { organizationId, userId },
	} = req;
	if (!auth)
		return res.send({
			error: {
				name: "readUser",
				message: "Unauthorized",
			},
		});
	if (
		auth.isAdmin ||
		auth.organizations.find(
			(organization) => organization._id == organizationId
		)
	) {
		mongoose
			.model("User")
			.findById(userId)
			.lean()
			.exec((error, user) => {
				// Check for errors
				if (error)
					return res.send({
						error: {
							name: "readUser",
							message: error,
						},
					});
				// Don't do anything if we didn't find someone
				if (!user)
					return res.send({
						error: {
							name: "readUser",
							message: `User not found`,
						},
					});
				// Clear any incriminating evidence
				delete user.password;
				delete user.__v;
				// Send out the user
				return res.send({ user });
			});
	} else {
		return res.send({
			error: {
				name: "readUser",
				message: "Unauthorized",
			},
		});
	}
});

const updateUser = (module.exports.update = (req, res, next) => {
	const {
		auth,
		params: { userId },
		body: { user: updateUser },
	} = req;
	if (!auth)
		return res.send({
			error: {
				name: "updateUser",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin || auth._id == userId) {
		// Make sure to hash that password
		if (updateUser.password)
			updateUser.password = bcrypt.hashSync(updateUser.password, 10);
		// Run the update
		mongoose
			.model("User")
			.findByIdAndUpdate(userId, updateUser, { new: true })
			.lean()
			.exec((error, user) => {
				// Check for errors
				if (error)
					return res.send({
						error: {
							name: "updateUser",
							message: error,
						},
					});

				// Don't do anything if we didn't find someone
				if (!user)
					return res.send({
						error: {
							name: "updateUser",
							message: `User not found`,
						},
					});
				// We're not passing around passwords, guys.
				delete user.password;
				return res.send({ user });
			});
	} else {
		return res.send({
			error: {
				name: "updateUser",
				message: "Unauthorized",
			},
		});
	}
});

const deleteUser = (module.exports.delete = (req, res, next) => {
	const {
		auth,
		params: { userId },
	} = req;
	if (!auth)
		return res.send({
			error: {
				name: "deleteUser",
				message: "Unauthorized",
			},
		});
	if (auth.isAdmin) {
		User.findByIdAndUpdate(userId, { active: false }, { new: true })
			.lean()
			.exec((error, user) => {
				if (error)
					return res.send({
						error: { name: "deleteUser", message: error },
					});
				// Don't do anything if we didn't find someone
				if (!user)
					return res.send({
						error: {
							name: "deleteUser",
							message: `User not found`,
						},
					});
				// We're not passing around passwords, guys.
				delete user.password;
				return res.send({ user });
			});
	} else {
		return res.send({
			error: {
				name: "deleteUser",
				message: "Unauthorized",
			},
		});
	}
});

const resetPassword = (module.exports.resetPassword = (req, res, next) => {
	const {
		query: { email },
	} = req;
	// Generate the message
	User.findOne({ email }, (error, user) => {
		// Make sure there's actually a user that matches
		if (!user)
			return res.send({
				error: {
					name: "resetPassword",
					message: `Password reset not available for ${email}`,
				},
			});
		// Convert the user collection to an object
		var payload = user.toObject();
		// Remove anything potentially private
		delete payload.password;
		delete payload.__v;
		// Generate a JWT token
		const token = jwt.sign(payload, config.jwt.secret, {
			expiresIn: config.jwt.exp,
		});
		mail.resetPassword({ email, token }, (error, body) => {
			// Make sure there's actually a user that matches
			if (error)
				return res.send({
					error: {
						name: "resetPassword",
						message: error,
					},
				});
			return res.send({
				complete: {
					name: "resetPassword",
					message: `An email reset link has been sent to ${email}.`,
				},
			});
		});
	});
});
