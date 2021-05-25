const User = require('../models/user')
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const {errorHandler} = require("../helpers/dbErrorHander")

/*
    User Sign up
*/
exports.signup = (req, res) => {

    //console.log("req.body", req.body);

    // Create a new user
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                errorCode: 1,
                message: errorHandler(err)              
            })
        }

        // Remove salt & hashed_password from respone
        user.salt = undefined
        user.hashed_password = undefined

        // Return User Information
        res.json({
            user
        });
    })
};

/*
    User Login
*/
exports.signin = (req, res) => {

    // Find User based on email
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                errorCode: 2,
                message: "Invalid email or account doesn't exist"
            })
        } else { 
            // User is found
            // Create authenticate method in user model
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    errorCode: 3,
                    message: "Invalid password"
                })
            }

            // Generate a signed token with user id and secret 
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)

            // Presist the token as 't' in cookie with expiry date
            res.cookie('t', token, {expire: new Date() + 3600 })

            // Return respone with user and token to frontend client
            const {_id, name, email, role} = user
            return res.json({token, user: {_id, name, email, role}})
        }
    })
};

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

      let user = req.profile && req.auth && req.profile._id == req.auth._id
        if (!user) {
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