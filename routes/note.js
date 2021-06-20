const express = require("express");
const router = express.Router();

const { createNote, getNotes, getNote, updateNote, delNote, noteById } = require('../controllers/note');
const { requireSignin, isAuth } = require("../controllers/auth");
const { setUser } = require("../controllers/user");

router.use(requireSignin, isAuth, setUser);

router.route("/note")
    .post(createNote)
    .get(getNotes);

router.route("/note/:noteId/")
    .get(getNote)
    .put(updateNote)
    .delete(delNote);

router.param('noteId', noteById)

module.exports = router;