const Expense = require("../models/expense");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectID;

exports.expenseById = (req, res, next, id)  => {
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid Object Id"
        });
    }
        if (req.profile.expenses.some(expense => expense.equals(id))) {
            Expense.findById(id)
                .then(expense => {
                    if (!expense) {
                        req.profile.expenses.remove(id);
                        User.findByIdAndUpdate(req.profile.id, { $set: req.profile }, { new: true })
                            .then( user => res.status(400).json({ events: user.expenses }),
                                err => res.status(400).json({ message: err.message } ))
                            .catch(err => res.status(400).json({ message: err.message } ))                     
                    } else {
                        req.expense = expense; 
                        next(); 
                    }
                },
                err => res.status(400).json({ message: err.message } ))
                .catch(err => res.status(400).json({ message: err.message } ))
        } else {
            res.status(400).json({ message: "unauth or doesn't exits" })
        }
}

exports.createExpense = (req, res) => {
    Expense.create(req.body)
    .then(expense => {
        User.findByIdAndUpdate(req.auth._id, { "$push": { "expenses": expense._id } }, { "new": true, "upsert": true })
            .then(user => {res.json(expense)},
                err => res.status(400).json({ message: err }))
            .catch(err => res.status(400).json({ message: err }))
    }, err => res.status(400).json({ message: err }))
    .catch(err => res.status(400).json({ message: err }));
}

exports.getExpense = (req, res) => {
    res.json(req.expense);
}

exports.updateExpense = (req, res) => {
    Expense.findByIdAndUpdate(req.expense.id, {
        $set: req.body
    }, { new: true })
    .then((expense) => res.json(expense), 
        err => res.status(400).json({ message: err.message } )
    .catch(err => res.status(400).json({ message: err.message } )));
}

exports.delExpense = (req, res) => {
    req.profile.expenses.remove(req.expense._id);
    User.findByIdAndUpdate(req.profile._id, { $set: req.profile }, { new: true })
        .then(user => { 
            Expense.findByIdAndRemove(req.expense._id)
            .then(expense => res.json(expense), 
                 err => res.status(400).json({ message: err.message } )      
            .catch(err => res.status(400).json({ message: err.message })))},
            err => res.status(400).json({ message: err.message }))
        .catch((err) => res.status(400).json({ message: err.message } ))
}

exports.getExpenses = (req, res) => {
    Expense.aggregate(
        [
            { 
                "$project" : { 
                    "_id" : 0, 
                    "expenses" : "$$ROOT"
                }
            }, 
            { 
                "$lookup" : { 
                    "localField" : "expenses._id", 
                    "from" : "users", 
                    "foreignField" : "expenses", 
                    "as" : "users"
                }
            }, 
            { 
                "$unwind" : { 
                    "path" : "$users", 
                    "preserveNullAndEmptyArrays" : false
                }
            }, 
            { 
                "$match" : { 
                    "users._id" : ObjectId(req.auth._id), 
                    "expenses.date" : { 
                        "$gte" : new Date(req.query.start),
                        "$lte" : new Date(req.query.end)
                    }
                }
            }, 
            { 
                "$project" : { 
                    _id : "$expenses._id", 
                    name : "$expenses.name", 
                    description : "$expenses.description", 
                    amount : "$expenses.amount", 
                    date : "$expenses.date", 
                    label : "$expenses.label",                                     
                    createdAt : "$expenses.createdAt",
                    updatedAt : "$expenses.updatedAt",
                    __v : "$expenses.__v",
                }
            }
        ]
    ).exec((err, expenses) => {
        if (err || !expenses || expenses.length == 0) {
            return res.status(400).json({
                error: "No expenses found"
            });
        }
        res.json(expenses);
    }); 
}

exports.expensesLabel = (req, res) => {
    req.profile.expenseLabels = req.body
    req.profile.save().then((user) => res.status(200).json(user.expenseLabels), 
        err => res.status(500).json({ message: err.message} ))
    .catch(err => res.status(500).json({ message: err.message} ))  
}