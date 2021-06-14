const express = require("express");
const router = express.Router();

const { signup, signin, signout, requireSignin } = require("../controllers/auth");
const { userSignupValidator } = require("../validator");
const { createBoard } = require('../controllers/board.js')

router.post("/signup", userSignupValidator, signup, createBoard);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;