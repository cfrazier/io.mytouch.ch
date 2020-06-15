const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const {
	Schema,
	Types: { ObjectId },
} = mongoose;
const { personSchema } = require("./person");

// Group Schema
exports.groupSchema = groupSchema = new Schema({
	phone: {
		type: String,
		validate: {
			validator: (value) => {
				return /\d{3}-\d{3}-\d{4}/.test(value); // US phone number support only
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
		required: [true, "User phone number required"],
		unique: true,
	},
	pin: {
		type: String,
		validate: {
			validator: (value) => {
				return /[0-9]{4}/.test(value); // Four digit number
			},
			message: (props) => `${props.value} is not a valid PIN!`,
		},
		required: [true, "PIN number is required"],
	},
	email: {
		type: String,
		validate: {
			validator: (value) => {
				return /[a-z0-9]+([-+._][a-z0-9]+){0,2}@.*?(\.(a(?:[cdefgilmnoqrstuwxz]|ero|(?:rp|si)a)|b(?:[abdefghijmnorstvwyz]iz)|c(?:[acdfghiklmnoruvxyz]|at|o(?:m|op))|d[ejkmoz]|e(?:[ceghrstu]|du)|f[ijkmor]|g(?:[abdefghilmnpqrstuwy]|ov)|h[kmnrtu]|i(?:[delmnoqrst]|n(?:fo|t))|j(?:[emop]|obs)|k[eghimnprwyz]|l[abcikrstuvy]|m(?:[acdeghklmnopqrstuvwxyz]|il|obi|useum)|n(?:[acefgilopruz]|ame|et)|o(?:m|rg)|p(?:[aefghklmnrstwy]|ro)|qa|r[eosuw]|s[abcdeghijklmnortuvyz]|t(?:[cdfghjklmnoprtvwz]|(?:rav)?el)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\b){1,2}/.test(
					value
				); // Standard email address
			},
			message: (props) => `${props.value} is not a valid email address!`,
		},
		required: [true, "An email address is required"],
	},
	name: { type: String, required: true },
	people: [personSchema],
});

groupSchema.plugin(uniqueValidator);

exports.Group = this.Group = mongoose.model("Group", groupSchema);
