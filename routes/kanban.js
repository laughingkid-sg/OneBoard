const express = require("express");
const router = express.Router();

const { createBoard, getBoards, delBoard, updateBoard, getBoard, boardById } = require('../controllers/board')
const { columnById, createColumn, getColumn, updateColumn, delColumn, setColOrder } = require('../controllers/column')
const { createTask, getTask, updateTask, taskById, delTask, setTaskOrder } = require('../controllers/task');

const { requireSignin, isAuth} = require("../controllers/auth");
const { userById, setUser } = require("../controllers/user");

router.use(requireSignin, isAuth, setUser)

// ----- Board ----- //

router.route("/")
    .get(getBoards) // Create Board
    .post(createBoard); // Get all user boards

router.get("/boards/", getBoards); // Get all user boards

router.route("/:boardId/")
    .get(getBoard) // Get single Board by Id
    .put(updateBoard) // Update Board by Id
    .delete(delBoard); // Delete Board by Id

// ----- Column ----- //

router.post("/column/:boardId/", setColOrder, createColumn); // Create Column

router.route("/column/:columnId/")
    .get(getColumn) // Get single Column by Id
    .put(updateColumn) // Update Column by Id
    .delete(delColumn); // Delete Column by Id

// ----- Task ----- //

router.post("/task/:columnId", setTaskOrder, createTask); // Create Task in Column

router.route("/task/:taskId/")
    .get(getTask) // Get Task by Id
    .put(updateTask) // Update Task by Id
    .delete(delTask); // Detele Task by Id

router.param('userId', userById)
router.param('boardId', boardById)
router.param('columnId', columnById)
router.param('taskId', taskById)

module.exports = router;