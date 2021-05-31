const User = require("../models/user")

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                errorCode: 6,
                message: "User not found"
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        req.profile = user;
        next();
    })
}

exports.setUser = (req, res, next) => {
    User.findById(req.auth._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                errorCode: 6,
                message: "User not found"
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        req.profile = user;
        next();
    })
}