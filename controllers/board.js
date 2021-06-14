
const Board = require("../models/board");
const User = require("../models/user");
const Column = require("../models/column");
const Task = require("../models/task");
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
        if (req.body.newUser) {
            const user = req.user;
            req.user.boards = [board._id];
            res.json({
                user
            });
        } else {
        res.status(200).json({ 
            message: 'Board successfully created.',
            _id: board._id
        });
        }

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            errorCode: 0,
            message: "Unknown error"
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
    Board.aggregate(
        [
            {
                $match: {
                    _id: ObjectId(id) 
                }
            },
            {
                $lookup: {
                    from: 'columns',
                    localField: 'columns',
                    foreignField: '_id',
                    as: 'columns'         
                }                  
            }, {
                $unwind: '$columns' 
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'columns.tasks',
                    foreignField: '_id',
                    as: 'columns.tasks'         
                }
            },
            {
                $group: {
                    '_id':{
                        '_id':'$_id',
                        'name':'$name', 
                        'labels': '$labels',
                        'createdAt': '$createdAt',
                        'updatedAt': '$updatedAt'
                    },
                'columns': {
                    '$push': '$columns'
                    }
                }
            }
        ]
    ).exec((err, board) => {
        if (err || !board) {
            return res.status(400).json({
                error: 'Board not found'
            })
        }
        req.board = board[0];
        req.board.details = req.board._id;
        req.board._id = req.board.details._id;
        next();
    });
};

exports.getBoard = (req, res) => {  
    
    User.findOne({
        boards: {
            $elemMatch: {
                $eq: ObjectId(req.board.details._id)
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
       //console.log(req.profile.boards)
       console.log(req.board._id)
    if (req.profile.boards.some(board => { return board.equals(req.board._id) })) {
        let columns = await Board.findById(req.board._id, { columns: 1, _id: 0 });
        columns['columns'].forEach(async column_id => {
            // Delete column's tasks.
            let tasks = await Column.findById(column_id, { tasks: 1, _id: 0 });
            tasks['tasks'].forEach(async task_id => {
                await Task.findByIdAndDelete(task_id);
            });
            await Column.findByIdAndDelete(column_id);
            let delBoard = await Board.deleteOne({ _id: req.board._id });

            if (delBoard.deletedCount && delBoard.deletedCount > 0) {
                await User.findByIdAndUpdate(req.user._id, { "$pull": { "projects": req.board._id } }, { "new": true, "upsert": true });
                res.status(200).json({ status: true, result: delBoard });
            } else {
                return res.status(400).json({
                    error: 'Access Denied1'
                });
            }    
        });
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
            res.status(200).json({ status: true, message: 'Board successfully updated.' });

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
