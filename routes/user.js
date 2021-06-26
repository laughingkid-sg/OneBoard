const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {  setUser, getUser } = require("../controllers/user");

const { userById } = require("../controllers/user");


router.route("/")
    .get(requireSignin, isAuth, setUser, getUser)

router.param('userId', userById)

module.exports = router;