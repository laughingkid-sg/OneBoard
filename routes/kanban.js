const express = require("express");
const router = express.Router();

const { createBoard, getBoards, delBoard, updateBoard, getBoard, boardById, columnById, createColumn, getColumn, getColumns, updateColumn, delColumn } = require("../controllers/kanban");
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

router.delete("/kanban/:boardId",
    requireSignin,
    isAuth, 
    setUser,
    delBoard
);

router.put("/kanban/:boardId",
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

router.delete("/kanban/:boardId/:columnId/",
    requireSignin,
    isAuth, 
    setUser,
    delColumn
);


router.param('userId', userById)
router.param('boardId', boardById)
router.param('columnId', columnById)

module.exports = router;