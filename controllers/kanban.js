const { errorHandler } = require('../helpers/dbErrorHander');
const Board = require("../models/board");
const Column = require("../models/column");
const Task = require("../models/task");
const User = require("../models/user");

// Create Board
exports.createBoard = async (req, res) => {
    try {
        let board = new Board(req.body);
        await board.validate(req.body); 

        board = await board.save(req.body);
        //console.log(req.params.userId);
        // console.log(board._id);

        await User.findByIdAndUpdate(req.params.userId, { 
            "$push": { 
                "boards": board._id 
            } 
        }, 
        { 
            "new": true, 
            "upsert": true 
        });

        let todo = await new Column({ 
            "name": "To-Do", 
            "board_id": board._id 
            }).save();

        let inprogress = await new Column({ 
                    "name": "In Progress",  
                    "board_id": board._id 
                }).save();
                let done = await new Column({ 
                    "name": "Done", 
                    "board_id": board._id }).save();
                await Board.findByIdAndUpdate(board._id, { 
                    "$push": { 
                        "columns": [
                            todo._id, 
                            inprogress._id, 
                            done._id] 
                        } 
                    }, 
                    { 
                        "upsert": true 
                    }
                ); 

                let example_task = await new Task({
                    "name": "Example Task",
                    "label": "feature",
                    "labelType": "info",
                    "expireAt": new Date()
                }).save();

                await Column.findByIdAndUpdate(todo._id, { 
                    "$push": { 
                        "tasks": [
                            example_task._id
                        ] 
                    } 
                }, { 
                    "upsert": true 
                });

        res.status(200).json({ message: 'Board successfully created.' });

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
}

// Get Boards
exports.getBoards = async (req, res) => { 
     User.findById(req.params.userId).populate('boards').exec((err, user) => {         
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        res.json(user.boards);
    })
}

// Get Single Board

exports.boardById = (req, res, next, id) => {
    Board.findById(id).exec((err, board) => {
        if (err || !board) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.board = board;
        next();
    });
};

exports.getBoard = (req, res) => {
    return res.json(req.board);
}