const Event = require("../models/event");
const User = require("../models/user");
const ObjectId = require('mongodb').ObjectID;

exports.createEvent = (req, res) => {
    Event.create(req.body)
    .then(event => {
        User.findByIdAndUpdate(req.auth._id, { "$push": { "events": event._id } }, { "new": true, "upsert": true })
            .then(user => {res.json(event)},
                err => res.status(400).json({ message: err }))
            .catch(err => res.status(400).json({ message: err }))
    }, err => res.status(400).json({ message: err }))
    .catch(err => res.status(400).json({ message: err }));
}

exports.getEvents = (req, res) => {   
     Event.aggregate(
        [
            { 
                "$project" : { 
                    "_id" : 0, 
                    "events" : "$$ROOT"
                }
            }, 
            { 
                "$lookup" : { 
                    "localField" : "events._id", 
                    "from" : "users", 
                    "foreignField" : "events", 
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
                    "$and" : [
                        { 
                            "events.start" : { 
                                //"$gte" : new Date("2021-06-01T15:45:48.386+0000")
                                "$gte" : new Date(req.query.start)
                            }
                        }, 
                        { 
                            "events.end" : { 
                                //"$lte" : new Date("2021-06-30T15:45:48.386+0000")
                                "$lte" : new Date(req.query.end)
                            }
                        }, 
                        { 
                            "users._id" : ObjectId(req.auth._id)
                        }
                    ]
                }
            },
            {   
                $project: {
                    _id: "$events._id",
                    name: "$events.name",
                    allDay: "$events.allDay",
                    start : "$events.start",
                    end : "$events.end",
                    createdAt: "$events.createdAt",
                    updatedAt: "$events.updatedAt",
                    description: "$events.description",
                    place: "$events.place",
                    __v: "$events.__v"
                } 
            }           
        ]
     ).exec((err, event) => {

        if (err || !event || event.length == 0) {
            return res.status(400).json({
                error: "Event not found"
            });
        }

        res.json(event);
    });   
 }

exports.eventById = (req, res, next, id)  => {
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid Object Id"
        });
    }
        if (req.profile.events.some(event => event.equals(id))) {
            Event.findById(id)
                .then(event => {
                    if (!event) {
                        req.profile.events.remove(id);
                        User.findByIdAndUpdate(req.profile.id, { $set: req.profile }, { new: true })
                            .then( user => res.status(400).json({ events: user.events }),
                                err => res.status(400).json({ message: err.message } ))
                            .catch(err => res.status(400).json({ message: err.message } ))                     
                    } else {
                        req.event = event; 
                        next(); 
                    }
                },
                err => res.status(400).json({ message: err.message } ))
                .catch(err => res.status(400).json({ message: err.message } ))
        } else {
            res.status(400).json({ message: "unauth" })
        }
}

exports.getEvent = (req, res) => {
    res.json(req.event);
}

exports.updateEvent = (req, res) => {
    Event.findByIdAndUpdate(req.event.id, {
        $set: req.body
    }, { new: true })
    .then((event) => res.json({ status: true, message: 'Event successfully updated.', event: event }), 
        err => res.status(400).json({ message: err.message } )
    .catch(err => res.status(400).json({ message: err.message } )));
}

exports.delEvent = (req, res) => {
    req.profile.events.remove(req.event._id);
    User.findByIdAndUpdate(req.profile._id, { $set: req.profile }, { new: true })
        .then(user => { 
            Event.findByIdAndRemove(req.event._id)
            .then(event => res.json({ status: true, message: 'Event successfully deleted.', event: event }), 
                 err => res.status(400).json({ message: err.message } )      
            .catch(err => res.status(400).json({ message: err.message })))},
            err => res.status(400).json({ message: err.message }))
        .catch((err) => res.status(400).json({ message: err.message } ))
}

exports.updateFeatured = (req, res) => {
    req.profile.featured = req.event._id;
    User.findByIdAndUpdate(req.profile._id, { $set: req.profile }, { new: true }).then(
        user => res.status(204).json(user),
        err => res.status(400).json({ message: err.message })
        .catch((err) => res.status(400).json({ message: err.message } ))
    )
}

exports.removeFeatured = (req, res) => {
    if (!req.profile.featured) {
        res.status(400).json({ message: "No featured event set." } )
    } else {
        User.findByIdAndUpdate(req.profile._id, { $unset: { featured: "" }}).then(
            user => res.status(204).json(user),
            err => res.status(400).json({ message: err.message })
            .catch((err) => res.status(400).json({ message: err.message } ))
        )
    }
}