const mongoose = require("mongoose");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;

// Venue Schema
exports.venueSchema = venueSchema = new Schema({
	organizationId: { type: ObjectId, ref: "Organization", required: true },
	capacity: { type: Number, required: true },
	active: { type: Boolean, default: true, required: true },
	code: { type: String, required: true, default: "1234" },
	name: String,
	description: String,
	address: {
		street1: String,
		street2: String,
		city: String,
		state: String,
		postal: String,
		country: String,
	},
	ageMin: Number,
	ageMax: Number,
});

exports.Venue = this.Venue = mongoose.model("Venue", venueSchema);
