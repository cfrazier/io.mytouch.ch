const mongoose = require("mongoose");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;

const { groupSchema } = require("./group");
const { personSchema } = require("./person");
const { venueSchema } = require("./venue");

// CheckIn Schema
exports.checkInSchema = checkInSchema = new Schema({
	group: { type: groupSchema, required: true },
	person: { type: personSchema, required: true },
	venue: { type: venueSchema, required: true },
	enter: { type: Date, required: true },
	exit: { type: Date, required: true },
});

exports.CheckIn = this.CheckIn = mongoose.model("CheckIn", checkInSchema);
