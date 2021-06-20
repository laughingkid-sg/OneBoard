const express = require("express");
const router = express.Router();

const { createBoard, getBoards, delBoard, updateBoard, getBoard, boardById } = require('../controllers/board')
const { columnById, createColumn, getColumn, updateColumn, delColumn} = require('../controllers/column')
const { createTask, getTask, updateTask, taskById, delTask} = require('../controllers/task');

const { requireSignin, isAuth} = require("../controllers/auth");
const { userById, setUser } = require("../controllers/user");

// ----- Board ----- //

// Create Board
router.post("/kanban/", 
    requireSignin, 
    isAuth,
    createBoard
);

// Get all user boards
router.get("/kanban/boards/", 
    requireSignin, 
    isAuth, 
    getBoards
);

// Get single Board by Id
router.get("/kanban/:boardId/", 
    requireSignin, 
    isAuth, 
    getBoard
);

// Update Board by Id
router.put("/kanban/:boardId/",
    requireSignin,
    isAuth, 
    setUser,
    updateBoard
);

// Delete Board by Id
router.delete("/kanban/:boardId/",
    requireSignin,
    isAuth, 
    setUser,
    delBoard
);

// ----- Column ----- //

// Create Column
router.post("/kanban/column/:boardId/",
    requireSignin,
    isAuth, 
    setUser,
    createColumn
);

// Get single Column by Id
router.get("/kanban/column/:columnId/",
    requireSignin,
    isAuth, 
    setUser,
    getColumn
);

// Update Column by Id
router.put("/kanban/column/:columnId/",
    requireSignin,
    isAuth, 
    setUser,
    updateColumn
);

// Delete Column by Id
router.delete("/kanban/column/:columnId/",
    requireSignin,
    isAuth, 
    setUser,
    delColumn
);

// ----- Task ----- //

// Create Task in Column
router.post("/kanban/task/:columnId",
    requireSignin,
    isAuth, 
    setUser,
    createTask
);

// Get Task by Id
router.get("/kanban/task/:taskId/",
    requireSignin,
    isAuth, 
    setUser,
    getTask
);

// Update Task by Id
router.put("/kanban/task/:taskId/",
    requireSignin,
    isAuth, 
    setUser,
    updateTask
);

// Detele Task by Id
router.delete("/kanban/task/:taskId/",
    requireSignin,
    isAuth, 
    setUser,
    delTask
);

router.param('userId', userById)
router.param('boardId', boardById)
router.param('columnId', columnById)
router.param('taskId', taskById)

module.exports = router;