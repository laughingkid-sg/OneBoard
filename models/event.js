const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			require: false,
		},
		place: {
			type: String,
			require: false,
		},
		start: {
			type: Date,
			required: true,
		},
		end: {
			type: Date,
			required: true,
		},
		allDay: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("Events", eventSchema)
