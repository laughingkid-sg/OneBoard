const User = require("../models/user")

exports.userById = (req, res, next, id) => {
    try {
        User.findById(id).exec((err, user) => {
            if (!user) {
                res.status(404).json({
                message: "User not found"
                })
            } else if (err) {
                res.status(500).json({
                    message: err.message
                })
            } else {
                user.salt = undefined
                user.hashed_password = undefined
                req.profile = user;
                next();
            }
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.setUser = (req, res, next) => {
    try {
        User.findById(req.auth._id).exec((err, user) => {
            if (!user) {
                return res.status(400).json({
                    message: "User not found"
                })
            } else if (err) {
                res.status(500).json({
                    message: err.message
                })
            } else {
                req.profile = user;
                next();
            }    
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.getUser = (req, res) => {
    res.json({user: req.profile})
}

exports.setPass = async (req, res) => {
    await req.profile.changePassword(req.body.oldPassword, req.body.newPassword, (err, user) => err ? res.status(500).json({message: err.message}) : res.status(204).json(user))
}

exports.updateUser = (req, res) => {
    req.profile.firstName = req.body.firstName;
    req.profile.lastName = req.body.lastName;
    req.profile.save().then((user) => res.status(200).json(user), 
        err => res.status(500).json({ message: err.message} ))
    .catch(err => res.status(500).json({ message: err.message} ))   
}