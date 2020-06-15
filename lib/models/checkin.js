const mongoose = require("mongoose");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;

// CheckIn Schema
exports.checkInSchema = checkInSchema = new Schema({
	group: { type: Object, required: true },
	person: { type: Object, required: true },
	venue: { type: Object, required: true },
	enter: { type: Date, required: true, default: Date.now() },
	exit: { type: Date },
});

exports.CheckIn = this.CheckIn = mongoose.model("CheckIn", checkInSchema);
