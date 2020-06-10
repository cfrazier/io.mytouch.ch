const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;

const config = require("../config.json");

// User Schema
exports.userSchema = userSchema = new Schema({
	email: {
		type: String,
		required: true,
		createIndexes: {
			unique: true,
		},
	},
	password: {
		type: String,
		required: true,
	},
	name: String,
	approved: Boolean,
	isAdmin: Boolean,
});

userSchema.pre("save", function (next) {
	const user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();

	// generate a salt
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

const findUser = (userSchema.statics.findUser = (email, password, callback) => {
	mongoose.model("User").findOne(
		{
			email,
		},
		(error, user) => {
			if (error) {
				return callback(error, null);
			} else {
				if (user) {
					user.comparePassword(password, (error, isMatch) => {
						if (isMatch) {
							return callback(null, user);
						} else {
							return callback(
								{
									name: "auth",
									message: "Password is incorrect.",
								},
								null
							);
						}
					});
				} else {
					return callback(
						{
							name: "auth",
							message: "Email address not found.",
						},
						null
					);
				}
			}
		}
	);
});

const authenticate = (userSchema.statics.authenticate = (req, res, next) => {
	const { token } = req.cookies;
	const { email, password } = req.query;
	// Check to see if the user is actually attempting a log in
	if (email && password) {
		// Attempt to find the user
		mongoose.model("User").findUser(email, password, (error, user) => {
			if (error) {
				res.clearCookie("token");
				return res.send({
					error,
				});
			}
			if (user) {
				// Convert the user collection to an object
				var payload = user.toObject();
				// Remove anything potentially private
				delete payload.password;
				delete payload.__v;
				// Generate a JWT token
				const token = jwt.sign(payload, config.jwt.secret, {
					expiresIn: config.jwt.exp,
				});
				// Send the resulting token
				res.cookie("token", token);
				// Set up the request objects
				req.user = payload;
				// We can continue on to whatever else we were doing
				next();
			} else {
				res.clearCookie("token");
				return res.send({
					error: {
						name: "authorizeUser",
						message: "User not found.",
					},
				});
			}
		});
	} else if (token) {
		// Not logging in, so check the token
		jwt.verify(token, config.jwt.secret, (error, decoded) => {
			if (error) {
				// The token was bad, so we might as well completely invalidate it
				res.clearCookie("token");
				req.user = undefined;
				next();
			} else {
				req.user = decoded;
				next();
			}
		});
	} else {
		// Nothing really was done. Let's just clean up.
		res.clearCookie("token");
		req.user = undefined;
		next();
	}
});

const createSingleUser = (this.userSchema.statics.create = (req, res, next) => {

});

exports.User = User = mongoose.model("User", userSchema);
