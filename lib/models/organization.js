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
	url: String,
	active: Boolean,
	colors: [{ type: String }],
	approvals: [{ type: String }],
	users: [{ type: ObjectId, ref: "User" }],
});

exports.Organization = this.Organization = mongoose.model(
	"Organization",
	organizationSchema
);
