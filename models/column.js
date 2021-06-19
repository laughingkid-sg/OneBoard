const mongoose = require('mongoose');
const Joi = require('joi');

const columnSchema = new mongoose.Schema(
    {
        name: { 
            type: String,
            trim: true,
            required: true 
        },
        order: { 
            type: Number,
            required: true 
        },
        tasks: [
            { type: mongoose.Schema.Types.ObjectId, 
                ref: 'Task' 
            }
        ]
}, 
{
    timestamps : true
});

columnSchema.methods.joiValidate = (obj) => {
    const columnSchema = Joi.object({
        title: Joi.string().min(3).max(60).required(),
        project_id: Joi.string()
    })
    return Joi.validate(obj, columnSchema);
}

module.exports = mongoose.model('Column', columnSchema);