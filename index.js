//Dependencies
const morgan = require('morgan');
const express = require('express');
const app = express();
//Routers
const user = require('./routers/user');
const employee = require('./routers/employee');
//Middleware
const notFound = require('./middleware/notFound');
const auth = require('./middleware/auth');
const index = require('./middleware/index');
const database = require('./routers/database');

//app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*--ROUTES--*/
//If database is not loaded
app.use(database);
//If database has been registered
app.get('/', index);
app.use('/user', user);

app.use(auth);

app.use('/employee', employee);
app.use(notFound);

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Ajal Server is running...");
});
