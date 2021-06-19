const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const subTask = new Schema({
    name:  {
        type: String,
        required: true
    },
    isDone:  {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

const taskSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        order: { 
            type: Number,
            required: true 
        },
        description: {
            type: String,
            required: false,
            maxlength: 5000
        },
        expireAt: { 
            type: Date, 
            required: false 
        },
        labelName: { 
            type: String, 
            required: false,
            maxlength: 16
        }, 
        subTask: [subTask]   
    }, 
    {
        timestamps : true
    });

    taskSchema.methods.joiValidate = (obj) => {
    const taskSchema = Joi.object({
        title: Joi.string().min(3).max(60).required(),
        description: Joi.string().min(3).max(2000),
        column_id: Joi.string(),
        expireAt: Joi.date()
    })
    return Joi.validate(obj, taskSchema);
}

module.exports = mongoose.model('Task', taskSchema);