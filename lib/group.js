const mongoose = require("mongoose");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;
const { personSchema } = require("./person");

// Group Schema
exports.groupSchema = groupSchema = new Schema({
	name: String,
	pin: String,
	email: String,
	phone: String,
	people: [{ _id: ObjectId }],
});

exports.Group = this.Group = mongoose.model("Group", groupSchema);
