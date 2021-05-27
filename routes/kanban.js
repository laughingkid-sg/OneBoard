const express = require("express");
const router = express.Router();

const { createBoard, getBoards, getBoard, boardById } = require("../controllers/kanban");
const { requireSignin, isAuth} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/kanban/createBoard/:userId", 
    requireSignin, 
    isAuth, 
    createBoard
);

router.get("/kanban/:userId/getBoards", 
    requireSignin, 
    isAuth, 
    getBoards
);

router.get("/kanban/:userId/:boardId", 
    requireSignin, 
    isAuth, 
    getBoard
);

router.param('userId', userById)
router.param('boardId', boardById)

module.exports = router;