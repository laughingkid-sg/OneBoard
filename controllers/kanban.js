const { ContactSupportOutlined } = require('@material-ui/icons');
const { errorHandler } = require('../helpers/dbErrorHander');
const Board = require("../models/board");
const Column = require("../models/column");
const Task = require("../models/task");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectID;


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

exports.createTask = async (req, res) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
        req.board.columns.some(column => column.equals(req.column._id))) {

            let task = new Task(req.body);
            await task.validate(req.body); 

            task = await task.save(req.body);
            await Column.findByIdAndUpdate(req.column._id, { "$push": { "tasks": task._id } }, { "new": true, "upsert": true });
            res.status(200).json({ status: true, message: 'Task successfully created.' });
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
        console.log(err);
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
}

exports.taskById = (req, res, next, id) => {
    Task.findById(id).exec((err, task) => {
        if (err || !task) {
            return res.status(400).json({
                error: 'Task not found'
            })
        }
        req.task = task;
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
            res.status(200).json({ status: true, message: 'Tasks successfully updated.' });
                     
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

exports.delTask = async (req, res) => {
    
}

exports.getTasks = async (req, res) => {
    try {
        if (req.profile.boards.some(board => board.equals(req.board._id)) && 
        req.board.columns.some(column => column.equals(req.column._id))) {
            Column.findById(req.column._id).populate('tasks').exec((err, column) => {         
            console.log(err)
                if (err || !column) {
                    return res.status(400).json({
                        error: "User not found"
                    });
                }
            res.json(column.tasks);
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