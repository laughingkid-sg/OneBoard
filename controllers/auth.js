const User = require('../models/user')
const expressJwt = require("express-jwt"); // for authorization check
const {errorHandler} = require("../helpers/dbErrorHander")
const authenticate = require('../authenticate');
/*
    User Sign up
*/
exports.signup = (req, res, next) => {
    User.register(
        new User({
            username: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }), req.body.password, (err, user) => {
    if (err) {
      res.status(500).json({message: err.message});
    } else {
      user.save((err, user) => {
        if (err) {
            res.status(500).json({message: err.message})
        }

        user.salt = undefined
        user.hash = undefined

        req.body.name = "Sample Board"
        req.body.newUser = true
        req.auth = { "_id": user._id }
        req.user = user
        next();
      });
    }
  });
}

/*
    User Login
*/
exports.signin = (req, res) => {
    try {
        const token = authenticate.getToken({_id: req.user._id});
        const { _id, username, role } = req.user
        res.cookie('t', token, {expire: new Date() + 3600 })
        res.json({token: token, user: {
            _id, 
            username, 
            role
        }});
    } catch (err) {
        res.json(500).json(err.message);
    }
}

/*
    Signout
*/
exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({
        message: "Signout successful" 
    });
};

/*
    requireSignin - Added to pages to ensure that users signed in
*/
exports.requireSignin = expressJwt({
    secret: process.env.SECRETKEY,
    algorithms: ["HS256"],
    userProperty: "auth",
});

/*
  isAuth - Used to check if user has the correct authorisation
*/
exports.isAuth = (req, res, next) => {
    if (!authenticate.verifyUser) {
        res.status(403).json({
            message: "Insufficient permission"
        });
    } else {
        next();
    }
}

exports.telegramLink = (req, res) => {
    if (req.body.key == process.env.TELEGRAMKEY) {
        User.findByIdAndUpdate(req.profile._id, { telegramID: req.body.telegramID }, { new: true })
            .then((user) => res.status(200).send(user.firstName), 
            err => res.status(500).json({ message: err.message} ))
                .catch(err => res.status(500).json({ message: err.message} ))  
    } else {
        res.status(403).send()
    }
}

exports.telegramUnlink = (req, res) => {
    if (req.body.key == process.env.TELEGRAMKEY) {
        User.findOneAndUpdate({ telegramID:  req.body.telegramID }, {$unset: {telegramID: true}}, { new: true })
            .then((user) => res.status(204).send(), 
            err => res.status(500).json({ message: err.message} ))
            .catch(err => res.status(500).json({ message: err.message} ))  
    } else {
        res.status(403).send()
    }
}