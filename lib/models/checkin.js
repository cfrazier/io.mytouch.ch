const mongoose = require("mongoose");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;

// CheckIn Schema
exports.checkInSchema = checkInSchema = new Schema({
	personId: { type: ObjectId, ref: "Person", required: true },
	venueId: { type: ObjectId, ref: "Venue", required: true },
	enter: { type: Date, required: true },
	exit: { type: Date, required: true },
});

exports.CheckIn = this.CheckIn = mongoose.model("CheckIn", checkInSchema);
