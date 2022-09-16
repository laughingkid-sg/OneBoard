const mongoose = require("mongoose")
const Joi = require("joi")

const noteSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
			maxlength: 5000,
		},
	},
	{
		timestamps: true,
	}
)

noteSchema.methods.joiValidate = (obj) => {
	const noteSchema = Joi.object({
		name: Joi.string().min(2).max(60).required(),
	})
	return Joi.validate(obj, noteSchema)
}

module.exports = mongoose.model("Notes", noteSchema)
