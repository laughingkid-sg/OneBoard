const User = require('../models/user')
const expressJwt = require("express-jwt"); // for authorization check
const {errorHandler} = require("../helpers/dbErrorHander")
const authenticate = require('../authenticate');

/*
    User Sign up
*/
exports.signup = (req, res, next) => {
    User.register(new User({username: req.body.email,
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
    const token = authenticate.getToken({_id: req.user._id});
    const { _id, username, role } = req.user
    res.cookie('t', token, {expire: new Date() + 3600 })
    res.json({token: token, user: {
        _id, 
        username, 
        role
    }});
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
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
  });

/*
  isAuth - Used to check if user has the correct authorisation
*/
exports.isAuth = (req, res, next) => {

    if (!authenticate.verifyUser) {
        return res.status(403).json({
            errorCode: 4,
            message: "Access denied"
        });
    }

    next();

}

/*
    isAdmin - Used to check if user has admin rights
*/
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            errorCode: 5,
            message: "Access deined (Admin)"
        })
    }
    next();
}