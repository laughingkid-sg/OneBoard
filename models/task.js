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
        label:  { type: mongoose.Schema.Types.ObjectId, 
            ref: 'Board.Label' 
        }, 
        subTask: [subTask]   
    }, 
    {
        timestamps : true
    });

    taskSchema.methods.joiValidate = (obj) => {
    const taskSchema = Joi.object({
        name: Joi.string().min(3).max(60).required(),
        description: Joi.string().min(3).max(5000),
        column_id: Joi.string(),
        expireAt: Joi.date()
    })
    return Joi.validate(obj, taskSchema);
}

module.exports = mongoose.model('Task', taskSchema);