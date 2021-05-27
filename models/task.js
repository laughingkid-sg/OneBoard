const mongoose = require('mongoose');
const Joi = require('joi');

const taskSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        description: {
            type: String,
            required: false
        },
        expireAt: { 
            type: Date, 
            required: false 
        },
        label: { 
            type: String, 
            required: false 
        },
        labelType: { 
            type: String, 
            enum: [
                'danger', 
                'warning', 
                'primary', 
                'info', 
                'dark', 
                'success'
            ], 
            required: false 
            }
    }, 
    {
        timestamps : true
    });

    taskSchema.methods.joiValidate = (obj) => {
    const taskSchema = Joi.object({
        title: Joi.string().min(3).max(60).required(),
        description: Joi.string().min(3).max(2000),
        column_id: Joi.string(),
        expireAt: Joi.date(),
        label: Joi.string().min(3).max(15),
        labelType: Joi.string().valid("danger", "warning", "primary", "success", "info", "dark")
    })
    return Joi.validate(obj, taskSchema);
}

module.exports = mongoose.model('Task', taskSchema);