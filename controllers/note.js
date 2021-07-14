const Note = require("../models/note");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectID;

exports.createNote = async (req, res) => {
    try {
        let note = new Note(req.body);
        await note.validate(req.body); 
        note = await note.save(req.body);     
        await User.findByIdAndUpdate(req.auth._id, { "$push": { "notes": note._id } }, { "new": true, "upsert": true });
        res.status(200).json(note);        
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.getNotes = (req, res) => {   
   User.findById(req.auth._id).populate('notes')
    .then(user => res.json(user.notes), 
        err => res.status(500).json({ message: err }))
    .catch(err => res.status(500).json({ message: err }));
}

exports.noteById = (req, res, next, id) => { 
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid Object Id"
        });
    }
        if (req.profile.notes.some(note => note.equals(id))) {
            Note.findById(id)
                .then(note => {
                    if (!note) {
                        req.profile.notes.remove(id);
                        User.findByIdAndUpdate(req.profile.id, { $set: req.profile }, { new: true })
                            .then( user => res.status(404).json({ message: user.notes }),
                                err => res.status(500).json({ message: err.message } ))
                            .catch(err => res.status(500).json({ message: err.message } ))                     
                    } else {
                     req.note = note; 
                     next(); 
                    }
                },
                err => res.status(500).json({ message: err.message } ))
                .catch(err => res.status(500).json({ message: err.message } ))
        } else {
            res.status(403).json({ message: 'Insufficient permission' })
        }
}

exports.getNote = (req, res) => {
    res.json(req.note);
}

exports.updateNote = (req, res) => {
    Note.findByIdAndUpdate(req.note.id, {
        $set: req.body
    }, { new: true })
    .then((note) => res.json(note), 
        err => res.status(500).json({ message: err.message } )
    .catch(err => res.status(500).json({ message: err.message } )));
}

exports.delNote = (req, res) => {
    req.profile.notes.remove(req.note._id);
    User.findByIdAndUpdate(req.profile._id, { $set: req.profile }, { new: true })
        .then(user => { 
            Note.findByIdAndRemove(req.note._id)
            .then(note => res.json( note), 
                 err => res.status(500).json({ message: err.message } )      
            .catch(err => res.status(500).json({ message: err.message })))},
            err => res.status(500).json({ message: err.message }))
        .catch((err) => res.status(500).json({ message: err.message } ))
}