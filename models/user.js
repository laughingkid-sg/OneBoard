const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuidv1')

const passportLocalMongoose = require('passport-local-mongoose');

const {ObjectId} = mongoose.Schema

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 64
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 64
    },
    about: {
        type: String,
        trim: true,
    },
    role: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    history: {
        type: Array,
        default: []
    },
    boards: [{ 
        type: ObjectId, 
        ref: 'Boards',
        required: true
    }],
    notes: [{
        type: ObjectId, 
        ref: 'Notes',
        required: false
    }]
    ,
    events: [{
        type: ObjectId, 
        ref: 'Events',
        required: false
    }],
    featured: {
        type: ObjectId, 
        ref: 'Events',
        required: false
    }
}, {timestamps : true}
);

userSchema.methods.changePassword = (oldPassword, newPassword, cb) => {

    (!oldPassword || !newPassword) ? cb(new errors.MissingPasswordError(options.errorMessages.MissingPasswordError)) : undefined;

    const self = this;

    this.authenticate(oldPassword, (err, authenticated) => {
      err ? cb(err) : undefined;

      (!authenticated) ? cb(new errors.IncorrectPasswordError(options.errorMessages.IncorrectPasswordError)) : undefined;

      self.setPassword(newPassword, err, user => {
        (err) ? cb(err) : undefined;

        self.save((err, user) => {
            err ? cb(err) : undefined;
           cb(null, user);
        });
      });
    });
  };

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);