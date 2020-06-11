const mongoose = require("mongoose");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;

// Venue Schema
exports.venueSchema = venueSchema = new Schema({
	name: String,
	capacity: Number,
	ageMin: Number,
	ageMax: Number,
	active: Boolean,
	events: [
		{
			name: String,
			start: Date,
			end: Date,
		},
	],
});

exports.Venue = this.Venue = mongoose.model("Venue", venueSchema);
