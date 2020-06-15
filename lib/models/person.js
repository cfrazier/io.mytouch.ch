const mongoose = require("mongoose");
const {
	Schema,
	Types: { ObjectId },
} = mongoose;

// Person Schema
exports.personSchema = personSchema = new Schema({
	name: String,
	notes: String,
	birthdate: Date
});

exports.Person = this.Person = mongoose.model("Person", personSchema);
