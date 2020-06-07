const express = require('express');
const jwt = require('jsonwebtoken');
const user = express.Router();
const db = require('../config/database');

//Registrar un nuevo usuario
user.post("/signin", async (req, res, next) => {
    const { nombre, apellidos, telefono, email, direccion, estado, admin, password } = req.body;

    if(nombre && apellidos && telefono && email && direccion && estado && admin && password)
    {
        try {
            let query = "INSERT INTO Empleados(nombre, apellidos, telefono, email, direccion, estado, admin, password)";
            query += `VALUES ('${nombre}', '${apellidos}', '${telefono}', '${email}', '${direccion}', ${estado}, ${admin}, '${password}');`;
            /*
                INSERT INTO empleados(idEmpleado, nombre, apellidos, telefono, email, direccion, `estado`, admin, password) 
                VALUES ('','lol','apel','4423384387','lol@lol.com','direc',1,1,'12345')
            */
            const rows = await db.query(query);
            if(rows.affectedRows == 1)
            {
                return res.status(200).json({ code: 201, message: "Usuario registrado correctamente" });
            }
            
        } catch (e){console.log(e);} return res.status(200).json({ code: 500, message: "Ocurrio un error"});
    }
    return res.status(200).json({ code: 500, message: "Campos incompletos"});
});

//Logear a un usuario
user.post("/login", async(req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(200).json({ code: 500, message: "Campos incompletos"}); 

    try {
        const query = `SELECT * FROM empleados WHERE email = '${email}' AND password = '${password}';`;
        const rows = await db.query(query);
        if(rows.length == 1)
        {
            const token = jwt.sign({
                idEmpleado: rows[0].idEmpleado,
                email: rows[0].email
            }, "debugkey");
            return res.status(200).json({ code: 200, message: token });
        }
    } catch (e){console.log(e);} return res.status(200).json({ code: 401, message: "Usuario y/o password incorrectos"});
    
});


module.exports = user;