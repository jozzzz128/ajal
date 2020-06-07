const fs = require('fs');

function writeSync(file, jsonText){
    try {
        const wfile = fs.writeFileSync('./config/'+file, JSON.stringify(jsonText), 'utf8');
        return true;
    } catch (e){} return false;
}

module.exports = async (req, res, next) => {
    const flag = require('../config/loaded.json');
    //If database already loaded
    if(flag) next();
    else{
        const {host, user, password, database} = req.body;
        //Verify complete parameters
        /*if(!host || !user || !password || !database) 
        return res.status(200).json({ code: 0, message: "Database information incomplete" });*/
        try {
            //Load database info
            const rwDatabase = writeSync('dbinfo.json', {
                host : host,
                user : user,
                password : password,
                database : database
            });
            if(rwDatabase){
                    //Write tables and rows into Database
                    const db = require('../config/database');
                    let query1 = `
                    CREATE TABLE Empleados(
                        idEmpleado INT AUTO_INCREMENT,
                        nombre VARCHAR(45) NOT NULL,
                        apellidos VARCHAR(45) NOT NULL,
                        telefono VARCHAR(20),
                        email VARCHAR(40),
                        direccion VARCHAR(60),
                        estado TINYINT NOT NULL,
                        admin TINYINT NOT NULL,
                        password VARCHAR(128) NOT NULL,
                        CONSTRAINT PK_Empleados PRIMARY KEY (idEmpleado)
                    );`;
                    let query2 = `
                    CREATE TABLE Tokens( 
                        idToken INT AUTO_INCREMENT, 
                        token VARCHAR(200), 
                        CONSTRAINT PK_Token PRIMARY KEY (idToken) 
                    );`;
                    db.query(query1);
                    db.query(query2);
                    writeSync('loaded.json', true);
                    return res.status(200).json({ code: 1, message: "Database correctly loaded"});
            }
        } catch (e){
            console.log(e);
        } return res.status(200).json({ code: -1 , message: "Error at loading database info"});
    }
}