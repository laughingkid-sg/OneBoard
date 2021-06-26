const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {  setUser, getUser } = require("../controllers/user");

const { userById, setPass, updateUser } = require("../controllers/user");

router.use(requireSignin, isAuth, setUser)

router.route("/")
    .get(getUser)
    .post(updateUser);

router.route("/pass")
    .post(setPass)

router.param('userId', userById)

module.exports = router;