const express = require("express")
const mongoose = require('mongoose');
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
require('dotenv').config()
const passport = require('passport')
const cors = require('cors')


// import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const kanbanRoutes = require('./routes/kanban')
const noteRoutes = require('./routes/note')
const eventRoutes = require('./routes/event');
//const cors = require('./routes/cors');

// app
const app = express()

// db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB Connected'));

   

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(passport.initialize());
app.use(cors())

// routes middleware
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/kanban", kanbanRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/event", eventRoutes);

app.get('/', (req, res) => {
    res.json({message: "ok"})
});


const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});