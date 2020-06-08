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
const cors = require('./middleware/cors');
const database = require('./routers/database');

app.set("view engine","ejs");

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*--STAIC ROUTES--*/
app.use('/static',express.static(__dirname +'/static'));

/*--ROUTES--*/
app.get('/', (req, res) => { res.render('index'); });
//If database is not loaded
app.use(database);
//If database has been registered
app.use('/user', user);

app.use(auth);

app.use('/employee', employee);
app.use(notFound);

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Ajal Server is running...");
});
