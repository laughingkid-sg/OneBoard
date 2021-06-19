const { errorHandler } = require('../helpers/dbErrorHander');
const Board = require("../models/board");
const Column = require("../models/column");
const Task = require("../models/task");
const ObjectId = require('mongodb').ObjectID;

function getOrder(boardId) {
    Column.aggregate(
        [
            { 
                "$project" : { 
                    "_id" : 0, 
                    "columns" : "$$ROOT"
                }
            }, 
            { 
                "$lookup" : { 
                    "localField" : "columns._id", 
                    "from" : "boards", 
                    "foreignField" : "columns", 
                    "as" : "boards"
                }
            }, 
            { 
                "$unwind" : { 
                    "path" : "$boards", 
                    "preserveNullAndEmptyArrays" : false
                }
            }, 
            { 
                "$match" : { 
                    "boards._id" : ObjectId(boardId)
                }
            }, 
            { 
                "$group" : { 
                    "_id" : { 
    
                    }, 
                    "MAX(columns᎐order)" : { 
                        "$max" : "$columns.order"
                    }
                }
            }, 
            { 
                "$project" : { 
                    "MAX(columns᎐order)" : "$MAX(columns᎐order)", 
                    "_id" : 0
                }
            }
        ]
    ).exec((err, col) => {
        console.log(col[0]['MAX(columns᎐order)']);
        return col[0]['MAX(columns᎐order)'];
    })
}

exports.createColumn = async (req, res) => {
    try {
        if (req.profile.boards.some(board => { return board.equals(req.board._id) })) {
            let column = new Column(req.body); 
            await column.validate(req.body); 

            column = await column.save(req.body);
            await Board.findByIdAndUpdate(req.board._id, { "$push": { "columns": column._id } }, { "upsert": true });
            res.status(200).json({ status: true, message: 'Column successfully created.', data: column
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
    /*
    Column.findById(id).exec((err, column) => {
        if (err || !column) {
            return res.status(400).json({
                error: 'Column not found'
            })
        }
        req.column = column;
    });*/

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid Object Id"
        });
    }

    Column.aggregate(
        [
            { 
                "$project" : { 
                    "_id" : 0, 
                    "columns" : "$$ROOT"
                }
            }, 
            { 
                "$lookup" : { 
                    "localField" : "columns._id", 
                    "from" : "boards", 
                    "foreignField" : "columns", 
                    "as" : "boards"
                }
            }, 
            { 
                "$unwind" : { 
                    "path" : "$boards", 
                    "preserveNullAndEmptyArrays" : false
                }
            }, 
            { 
                "$match" : { 
                    "columns._id" : ObjectId(id) 
                }
            },
            {
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
                "$limit" : 1
            }
        ]
      
    ).exec((err, col) => {
        console.log(col)
        if (err || !col || col.length == 0) {
            return res.status(400).json({
                error: "Column not found"
            });
        }
        req.board = col[0]['boards'];
        req.column = col[0]['columns'];  
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
            Board.findById(req.board._id).populate({path: 'columns', populate: { path: 'tasks', model: 'Task'}}).exec((err, board) => {         
                if (err || !board) {
                    console.log(err)
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

            req.body._id = req.column._id;
            let column = new Column(req.body);
            await column.validate(req.body); 

            column = await Column.findByIdAndUpdate(req.column._id, { $set: req.body }, { new: true });
            res.status(200).json({ status: true, message: 'Column successfully updated.', column: column });
                     
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
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
            req.board.columns.some(column => column.equals(req.column._id))) {

                let tasks = await Column.findById(req.column._id, { tasks: 1, _id: 0 });
                tasks['tasks'].forEach(async task_id => {
                    await Task.findByIdAndDelete(task_id);
                });

                let deletedColumn = await Column.deleteOne({ _id: req.column._id });
                if (deletedColumn.deletedCount && deletedColumn.deletedCount > 0) {
                     await Board.findByIdAndUpdate(req.board._id, { "$pull": { "columns": req.column._id } }, { "new": true, "upsert": true });
                     res.status(200).json({ status: true, message: 'Column successfully deleted.', column: deletedColumn });
                }                    
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