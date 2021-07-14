const Expense = require("../models/expense");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectID;

const fs = require("fs");
const fastcsv  = require("fast-csv");

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
                        .then( user => res.status(404).json({ message: user.expenses }),
                            err => res.status(500).json({ message: err.message } ))
                        .catch(err => res.status(500).json({ message: err.message } ))                     
                } else {
                    req.expense = expense; 
                    next(); 
                }
            },
            err => res.status(500).json({ message: err.message } ))
            .catch(err => res.status(500).json({ message: err.message } ))
    } else {
        res.status(404).json({ message: "Expense does not exist" })
    }
}

exports.createExpense = (req, res) => {
    Expense.create(req.body)
    .then(expense => {
        User.findByIdAndUpdate(req.auth._id, { "$push": { "expenses": expense._id } }, { "new": true, "upsert": true })
            .then(user => {res.json(expense)},
                err => res.status(500).json({ message: err }))
            .catch(err => res.status(500).json({ message: err }))
    }, err => res.status(500).json({ message: err }))
    .catch(err => res.status(500).json({ message: err }));
}

exports.getExpense = (req, res) => {
    res.json(req.expense);
}

exports.updateExpense = (req, res) => {
    Expense.findByIdAndUpdate(req.expense.id, {
        $set: req.body
    }, { new: true })
    .then((expense) => res.json(expense), 
        err => res.status(500).json({ message: err.message } )
    .catch(err => res.status(500).json({ message: err.message } )));
}

exports.delExpense = (req, res) => {
    req.profile.expenses.remove(req.expense._id);
    User.findByIdAndUpdate(req.profile._id, { $set: req.profile }, { new: true })
        .then(user => { 
            Expense.findByIdAndRemove(req.expense._id)
            .then(expense => res.json(expense), 
                 err => res.status(500).json({ message: err.message } )      
            .catch(err => res.status(500).json({ message: err.message })))},
            err => res.status(500).json({ message: err.message }))
        .catch((err) => res.status(500).json({ message: err.message } ))
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
        if (err) {
            res.status(500).json({
                message: err.message
            });
        }
        else if (!expenses || expenses.length == 0) {
            res.status(404).json({
                message: "No expenses found"
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

exports.expenseUpload = async (req, res) => {

    if (req.file == undefined) {
        res.status(400).send("Please upload a CSV file");
    }

    let expenses = [];
    const path = __dirname + "/.." + "/resources/static/assets/uploads/" + req.file.filename;

    let stream = fs.createReadStream(path);
    
    let csvStream = fastcsv
        .parse()
        .on("data", data => {
            expenses.push({
                name: data[0],
                description: data[1],
                date: isNaN(Date.parse(data[2])) ? Date.now() : Date.parse(data[2]),
                amount: isNaN(data[3]) ? 0.01 : data[3],
            });
        })
        .on("end", () => {
            expenses.shift();
            Expense.insertMany(expenses)
            .then(result => { 
                fs.unlink(path, err => err ? console.log(err) : undefined); 
                res.status(200).json(result)
            })
            .catch(err => res.status(500).json(err.message));
        })
    stream.pipe(csvStream);
};