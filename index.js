//Dependencies
const morgan = require('morgan');
const express = require('express');
const app = express();
//Routers
/*const users = require('./routers/users');
const employees = require('./routers/users');
const tokens = require('./routers/users');*/
//Middleware
/*const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const cors = require('./middleware/cors');*/
const database = require('./routers/database');

//app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//If database is not loaded
app.use(database);
//If database has been registered
app.get('/', (req, res) => {
    res.status(200).json({ code: 200, message: 'Welcome to Ajal' });
});
/*RUTAS*/
/*app.use("/employees", employees);
app.use("/tokens", tokens);
app.use(auth);
app.use(notFound);*/


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Ajal Server is running...");
});
