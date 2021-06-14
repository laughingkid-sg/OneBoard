const express = require("express");
const router = express.Router();

const { createBoard, getBoards, delBoard, updateBoard, getBoard, boardById } = require('../controllers/board.js')

const { columnById, createColumn, getColumn, getColumns, updateColumn, createTask, getTask, updateTask, taskById, getTasks} = require("../controllers/kanban");
const { requireSignin, isAuth} = require("../controllers/auth");
const { userById, setUser } = require("../controllers/user");

router.post("/kanban/", 
    requireSignin, 
    isAuth,
    createBoard
);

router.get("/kanban/boards/", 
    requireSignin, 
    isAuth, 
    getBoards
);

router.get("/kanban/:boardId/", 
    requireSignin, 
    isAuth, 
    getBoard
);

router.delete("/kanban/:boardId/",
    requireSignin,
    isAuth, 
    setUser,
    delBoard
);


router.put("/kanban/:boardId/",
    requireSignin,
    isAuth, 
    setUser,
    updateBoard
);

router.post("/kanban/:boardId/",
    requireSignin,
    isAuth, 
    setUser,
    createColumn
);

router.get("/:boardId/columns/", 
    requireSignin, 
    isAuth, 
    setUser,
    getColumns
);

router.get("/kanban/:boardId/:columnId/",
    requireSignin,
    isAuth, 
    setUser,
    getColumn
);

router.put("/kanban/:boardId/:columnId/",
    requireSignin,
    isAuth, 
    setUser,
    updateColumn
);



router.post("/kanban/:boardId/:columnId/",
    requireSignin,
    isAuth, 
    setUser,
    createTask
);

router.get("/kanban/:boardId/:columnId/tasks", 
    requireSignin, 
    isAuth, 
    setUser,
    getTasks
);


router.get("/kanban/:boardId/:columnId/:taskId/",
    requireSignin,
    isAuth, 
    setUser,
    getTask
);

router.put("/kanban/:boardId/:columnId/:taskId/",
    requireSignin,
    isAuth, 
    setUser,
    updateTask
);



router.param('userId', userById)
router.param('boardId', boardById)
router.param('columnId', columnById)
router.param('taskId', taskById)

module.exports = router;