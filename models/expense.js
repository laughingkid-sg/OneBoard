const mongoose = require("mongoose")
require("mongoose-currency").loadType(mongoose)
const Currency = mongoose.Types.Currency
const Schema = mongoose.Schema

const expenseSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			require: false,
		},
		date: {
			type: Date,
			required: true,
		},
		label: [
			{
				type: Schema.Types.ObjectId,
				ref: "User.Label",
			},
		],
		amount: {
			type: Currency,
			required: true,
			min: 0.01,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("Expenses", expenseSchema)
