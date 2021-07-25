const express = require("express");
const router = express.Router();

const { userById } = require("../controllers/user");

router.post("/:userId/", (req, res) => {
  
    req.profile.telegramID = req.body.telegramID;
    req.profile.save().then((user) => res.status(200).json({name: user.lastName}), 
    err => res.status(500).json({ message: err.message} ))
        .catch(err => res.status(500).json({ message: err.message} ))  

})

router.param('userId', userById)

module.exports = router;