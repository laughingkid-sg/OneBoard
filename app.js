const express = require("express")
const mongoose = require('mongoose');
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
require('dotenv').config()

// import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const kanbanRoutes = require('./routes/kanban')

// app
const app = express()

// db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB Connected'));



// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", kanbanRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});