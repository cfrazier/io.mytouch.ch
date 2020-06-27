const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const {
	Schema,
	Types: { ObjectId },
} = mongoose;

// Venue Schema
exports.venueSchema = venueSchema = new Schema({
	organizationId: { type: ObjectId, ref: "Organization", required: true },
	capacity: { type: Number, required: true },
	active: { type: Boolean, default: true, required: true },
	hidden: { type: Boolean, default: false },
	code: {
		type: String,
		required: true,
		unique: true,
	},
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
	color: String,
});

groupSchema.plugin(uniqueValidator);

exports.Venue = this.Venue = mongoose.model("Venue", venueSchema);
