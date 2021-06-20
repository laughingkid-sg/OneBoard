const Note = require("../models/note");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectID;

exports.createNote = async (req, res) => {
    try {
        let note = new Note(req.body);
        await note.validate(req.body); 
        note = await note.save(req.body);     
        await User.findByIdAndUpdate(req.auth._id, { "$push": { "notes": note._id } }, { "new": true, "upsert": true });
        res.status(200).json({ status: true, message: 'Note successfully created.', note: note });        
    } catch (err) {
        return res.status(400).json({
            errorCode: 0,
            message: "Unknow error"
        })
    }
}

exports.getNotes = (req, res) => {   
   User.findById(req.auth._id).populate('notes')
    .then(user => res.json(user.notes), 
        err => res.status(400).json({ message: err }))
    .catch(err => res.status(400).json({ message: err }));
}

exports.noteById = (req, res, next, id) => { 
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid Object Id"
        });
    }

    if (req.profile.notes.some(note => note.equals(id))) {
        Note.findById(id)
            .then(note => { req.note = note; next(); })
    } else {
        res.status(400).json({ message: "unauth" })
    }
 
}

exports.getNote = (req, res) => {
    res.json(req.note);
}

exports.updateNote = (req, res) => {
    Note.findByIdAndUpdate(req.note.id, {
        $set: req.body
    }, { new: true })
    .then((note) => res.json({ status: true, message: 'Note successfully updated.', note: note }), 
        err => res.status(400).json({ message: err.message } )
    .catch(err => res.status(400).json({ message: err.message } )));
}

exports.delNote = (req, res) => {
    Note.findByIdAndRemove(req.note._id)
    .then((note) => res.json({ status: true, message: 'Note successfully deleted.', note: note }), 
        err => res.status(400).json({ message: err.message } )
    .catch(err => res.status(400).json({ message: err.message } )));
}