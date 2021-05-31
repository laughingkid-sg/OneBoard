const { ContactSupportOutlined } = require('@material-ui/icons');
const { errorHandler } = require('../helpers/dbErrorHander');
const Board = require("../models/board");
const Column = require("../models/column");
const Task = require("../models/task");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectID;

// Create Board
exports.createBoard = async (req, res) => {
    try {
        let board = new Board(req.body);
        await board.validate(req.body); 

        board = await board.save(req.body);

        await User.findByIdAndUpdate(req.auth._id, { 
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
     User.findById(req.auth._id).populate('boards').exec((err, user) => {         
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
                error: 'Board not found'
            })
        }
        req.board = board;
        next();
    });
};

exports.getBoard = (req, res) => {  

    User.findOne({
        boards: {
            $elemMatch: {
                $eq: ObjectId(req.board._id)
            }
        }
    }).exec((err, user) => {        
        if (err || !user) {
            return res.status(400).json({
                error: 'Board not found'
            });
        } else if (user._id != req.auth._id) {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }        
        else {
            return res.json(req.board);
        }     
    })
}

// Delete Board

exports.delBoard = async (req, res) => {
   try {
    if (req.profile.boards.some(board => { return board.equals(req.board._id) })) {

    } else {
        return res.status(400).json({
            error: 'Access Denied'
        });
    }    
   } catch (err) {

   }
   
   return res.json(req.board);
   
}

exports.updateBoard = async (req, res, next) => {
    try {
        if (req.profile.boards.some(board => { return board.equals(req.board._id) })) {
            req.body._id = req.board._id;
            let board = new Board(req.body);
            await board.validate(req.body); 
            board = await Board.findByIdAndUpdate(req.board._id, { $set: req.body }, { new: true });
            res.status(200).json({ status: true, message: 'Project successfully updated.' });

        } else {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }    
       } catch (err) {
        console.log(err);
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
       }
 }

exports.createColumn = async (req, res) => {
    try {
        if (req.profile.boards.some(board => { return board.equals(req.board._id) })) {

            let column = new Column(req.body); 
            await column.validate(req.body); 

            column = await column.save(req.body);
            await Board.findByIdAndUpdate(req.board._id, { "$push": { "columns": column._id } }, { "upsert": true });
            res.status(200).json({ status: true, message: 'Column successfully created.' 
            });
        } else {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }    
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
       }
}

exports.columnById = (req, res, next, id) => {
    Column.findById(id).exec((err, column) => {
        if (err || !column) {
            return res.status(400).json({
                error: 'Column not found'
            })
        }
        req.column = column;
        next();
    });
};

 exports.getColumn = async (req, res, next) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
            req.board.columns.some(column => column.equals(req.column._id))) {

                return res.json(req.column);
          
        } else {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }    
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
 }

 exports.getColumns = async (req, res, next) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id))) {
            Board.findById(req.board._id).populate('columns').exec((err, board) => {         
            console.log(err)
                if (err || !board) {
                    return res.status(400).json({
                        error: "User not found"
                    });
                }
            res.json(board.columns);
            })
        } 
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
 }

exports.updateColumn = async (req, res) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
            req.board.columns.some(column => column.equals(req.column._id))) {
            
            console.log(req.body)

            req.body._id = req.column._id;
            let column = new Column(req.body);
            await column.validate(req.body); 

            column = await Column.findByIdAndUpdate(req.column._id, { $set: req.body }, { new: true });
            res.status(200).json({ status: true, message: 'Column successfully updated.' });
                     
        } else {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }    
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
}

exports.delColumn = async (req, res) => {
    
}