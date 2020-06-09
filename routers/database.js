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
        let {host, user, password, database} = req.body;
        //Verify complete parameters
        if(!host || !user || !password || !database){
            return res.status(200).json({ code: 0, message: "Database information incomplete" });
        }
        try {
            //Load database info
            const rwDatabase = writeSync('dbinfo.json', {
                host : host.trim(),
                user : user.trim(),
                password : password.trim(),
                database : database.trim()
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
                let query3 = `
                INSERT INTO empleados (idEmpleado, nombre, apellidos, telefono, email, direccion, estado, admin, password) 
                VALUES (1, 'name', 'lastname', '00000000', 'admin@admin.com', 'admins house', 1, 1, '1f3165d9c0f355332fd86dfd7c1ce5b7a65bd9ca6406c8a445ec1da83ac0bda8b4570713d114adae84a53e6b4d5e19c4631f30e42a146ba75630995a3801b994');
                `;
                db.query(query1);
                db.query(query2);
                db.query(query3);
                writeSync('loaded.json', true);
                return res.status(200).json({ code: 1, message: "Database correctly loaded"});
            }
        } catch (e){
            console.log(e);
        } return res.status(200).json({ code: -1 , message: "Error at loading database info"});
    }
}