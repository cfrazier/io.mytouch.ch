// Libraries
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Constants
const {
	Schema,
	Types: { ObjectId },
} = mongoose;
const config = require("../../config.json");

// User Schema
exports.userSchema = userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		createIndexes: {
			unique: true,
		},
	},
	password: {
		type: String,
		required: true,
	},
	name: String,
	resetToken: String,
	active: {
		type: Boolean,
		default: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

userSchema.plugin(uniqueValidator);

userSchema.pre("save", function (next) {
	const user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();
	// Update the password
	user.password = bcrypt.hashSync(user.password, 10);
	next();
});

userSchema.methods.comparePassword = function (password, callback) {
	return bcrypt.compareSync(password, this.password);
};

const findUser = (userSchema.statics.findUser = (email, password, callback) => {
	mongoose.model("User").findOne(
		{
			email: { $regex: new RegExp(email, "i") },
			active: true,
		},
		(error, user) => {
			if (error) {
				return callback(error, null);
			} else {
				if (user) {
					if (user.comparePassword(password)) {
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

exports.User = User = mongoose.model("User", userSchema);
