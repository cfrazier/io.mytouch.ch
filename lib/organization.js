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
	logo: String,
	active: Boolean,
	approvals: [
		{
			text: String,
		},
	],
	users: [userSchema],
	venues: [venueSchema],
});

exports.Organization = this.Organization = mongoose.model(
	"Organization",
	organizationSchema
);
