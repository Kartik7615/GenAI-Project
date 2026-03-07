//this file is responsible for creating the express app and configuring it with necessary middleware. It will be imported in the server.js file to start the server.

const express = require('express');
const cookieParser = require('cookie-parser');



const app = express();

app.use(express.json()); 
app.use(cookieParser()); 

//require the auth routes here
const authRouter = require('./routes/auth.routes');

//using all the routes here
app.use('/api/auth', authRouter);


module.exports = app;