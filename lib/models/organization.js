const mongoose = require("mongoose");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;

const { userSchema } = require("./user");
const { venueSchema } = require("./venue");

// Organization Schema
exports.organizationSchema = organizationSchema = new Schema({
	name: String,
	description: String,
	address: {
		street1: String,
		street2: String,
		city: String,
		state: String,
		postal: String,
		country: String
	},
	url: String,
	logo: String,
	active: Boolean,
	approvals: [
		{
			text: String,
		},
	],
	users: [{ _id: ObjectId }],
	venues: [{ _id: ObjectId }],
});

exports.Organization = this.Organization = mongoose.model(
	"Organization",
	organizationSchema
);
