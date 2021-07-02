const { errorHandler } = require('../helpers/dbErrorHander');
const Board = require("../models/board");
const Column = require("../models/column");
const Task = require("../models/task");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectID;

exports.setTaskOrder = (req, res, next) => {
    Task.aggregate(
        [
            { 
                "$project" : { 
                    "_id" : 0, 
                    "tasks" : "$$ROOT"
                }
            }, 
            { 
                "$lookup" : { 
                    "localField" : "tasks._id", 
                    "from" : "columns", 
                    "foreignField" : "tasks", 
                    "as" : "columns"
                }
            }, 
            { 
                "$unwind" : { 
                    "path" : "$columns", 
                    "preserveNullAndEmptyArrays" : false
                }
            }, 
            { 
                "$match" : { 
                    "columns._id" : ObjectId(req.column._id)
                }
            }, 
            { 
                "$group" : { 
                    "_id" : { 
    
                    }, 
                    "MAX(tasks᎐order)" : { 
                        "$max" : "$tasks.order"
                    }
                }
            }, 
            { 
                "$project" : { 
                    "MAX(tasks᎐order)" : "$MAX(tasks᎐order)", 
                    "_id" : 0
                }
            }
        ]
    ).exec((err, task) => {
        req.body.order = task[0] == undefined ? 0 : parseInt(task[0]['MAX(tasks᎐order)'], 10) + 1;
        next();
    })    
}

exports.createTask = async (req, res) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
        req.board.columns.some(column => column.equals(req.column._id))) {

            let task = new Task(req.body);
            await task.validate(req.body); 

            task = await task.save(req.body);
            await Column.findByIdAndUpdate(req.column._id, { "$push": { "tasks": task._id } }, { "new": true, "upsert": true });
            res.status(200).json({ status: true, message: 'Task successfully created.', task: task });
        } else {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }    
    } catch (err) {
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
       }
}

exports.getTask = async (req, res) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
            req.board.columns.some(column => column.equals(req.column._id)) &&
            req.column.tasks.some(task => task.equals(req.task._id))) {
                return res.json(req.task);       
        } else {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }    
    } catch (err) {
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
}

exports.taskById = (req, res, next, id) => {

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid Object Id"
        });
    }

    Task.aggregate(
        [
            { 
                "$project" : { 
                    "_id" : 0, 
                    "tasks" : "$$ROOT"
                }
            }, 
            { 
                "$lookup" : { 
                    "localField" : "tasks._id", 
                    "from" : "columns", 
                    "foreignField" : "tasks", 
                    "as" : "columns"
                }
            }, 
            { 
                "$unwind" : { 
                    "path" : "$columns", 
                    "preserveNullAndEmptyArrays" : false
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
                    "tasks._id" : ObjectId(id)
                }
            }, 
            { 
                "$limit" : 1
            }
        ]
    ).exec((err, task) => {

        if (err || !task || task.length == 0) {
            return res.status(400).json({
                error: "Task not found"
            });
        }

        req.board = task[0]['boards'];
        req.column = task[0]['columns'];  
        req.task = task[0]['tasks'];  
        next();
    });   
};

exports.updateTask = async (req, res) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
            req.board.columns.some(column => column.equals(req.column._id)) &&
            req.column.tasks.some(task => task.equals(req.task._id))) {

            req.body._id = req.task._id;
            let task = new Task(req.body);
            await task.validate(req.body); 

            task = await Task.findByIdAndUpdate(req.task._id, { $set: req.body }, { new: true });
            res.status(200).json({ status: true, message: 'Tasks successfully updated.', task: task });
                     
        } else {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }    
    } catch (err) {
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
}

exports.delTask = async (req, res) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
            req.board.columns.some(column => column.equals(req.column._id)) &&
            req.column.tasks.some(task => task.equals(req.task._id))) {

                let deletedTask = await Task.deleteOne({ _id: req.task._id });
                if (deletedTask.deletedCount && deletedTask.deletedCount > 0) {
                    await Column.findByIdAndUpdate(req.column._id, { "$pull": { "tasks": req.task._id } }, { "new": true, "upsert": true });
                    res.status(200).json({ status: true, message: 'Tasks successfully deleted.', task: deletedTask });
                }
                     
        } else {
            return res.status(400).json({
                error: 'Access Denied'
            });
        }    
    } catch (err) {
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
}