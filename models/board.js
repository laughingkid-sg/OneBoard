const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema

const labelSchema = new Schema({
    label:  {
        type: String,
        required: true
    },
    labelType:  {
        type: String,
        enum: [
            'danger', 
            'warning', 
            'primary', 
            'info', 
            'dark', 
            'success'
        ],
        required: true
    }
}, {
    timestamps: true
});

const boardSchema = new Schema(
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
        ],
        labels: [labelSchema]      
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