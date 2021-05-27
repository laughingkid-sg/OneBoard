const mongoose = require('mongoose');
const Joi = require('joi');
const {ObjectId} = mongoose.Schema

const boardSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            trim: true,
            required: true 
        },
        columns: [
            { 
                type: ObjectId, 
                ref: 'Column' 
            }
        ]
    }, 
    {
        timestamps : true
    });

    boardSchema.methods.joiValidate = (obj) => {
    const boardSchema = Joi.object({
        title: Joi.string().min(3).max(60).required()
    })
    return Joi.validate(obj, boardSchema);
}

module.exports = mongoose.model('Boards', boardSchema);