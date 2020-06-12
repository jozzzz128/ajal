const express = require('express');
const emplo = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const hash = require('../middleware/hash');

//Mostrar la informacion 
emplo.post("/", async (req, res) => {
    try {
        const token = jwt.verify(req.headers.authorization.split(" ")[1], "debugkey");
        let idEmpleado = req.body.id;
        if(!idEmpleado) idEmpleado = token.idEmpleado;
        let query = "SELECT admin FROM empleados WHERE idEmpleado = "+token.idEmpleado+";";
        let rows = await db.query(query);
        if(idEmpleado != token.idEmpleado && rows[0].admin != 1) return res.status(200).json({ code:409, message: 'Nos dispones de permisos para realizar esta acción'});
        query = "SELECT idEmpleado, nombre, apellidos, telefono, email, direccion, estado, admin FROM empleados WHERE idEmpleado = "+idEmpleado+";";
        rows = await db.query(query);
        return res.status(200).json({ code:200, message: 'Información del usuario cargada exitosamente', employee: rows});
    } catch (error) { console.log(error);}
    return res.status(200).json({ code:409, message: 'Sessión invalida, se requiere volver a iniciar sesión'});
});

//Buscar empleados
emplo.post("/search", async (req, res) => {
    try {
        const token = jwt.verify(req.headers.authorization.split(" ")[1], "debugkey");
        const search = req.body.search;
        let query = "SELECT admin FROM empleados WHERE idEmpleado = "+token.idEmpleado+";";
        let rows = await db.query(query);
        //Validaciones
        if(rows[0].admin != 1) return res.status(200).json({ code:409, message: 'No tienes permisos suficientes para realizar esta operación'});
        if(!search) return res.status(200).json({ code:409, message: 'Falta incluir el parametro de busqueda'});
        query = `SELECT idEmpleado, nombre, apellidos, email FROM empleados WHERE nombre LIKE '%${search}%' AND idEmpleado != ${token.idEmpleado} OR apellidos LIKE '%${search}%' AND idEmpleado != ${token.idEmpleado} OR telefono LIKE '%${search}%' AND idEmpleado != ${token.idEmpleado} OR email LIKE '%${search}%' AND idEmpleado != ${token.idEmpleado} OR email LIKE '%${search}%' AND idEmpleado != ${token.idEmpleado} OR direccion LIKE '%${search}%' AND idEmpleado != ${token.idEmpleado};`;
        rows = await db.query(query);
        return res.status(200).json({ code:200, message: 'Busqueda exitosa', employees: rows});
    } catch (error) {
        console.log(error);
    }
    return res.status(200).json({ code:409, message: 'Sessión invalida, se requiere volver a iniciar sesión'});
});

//Actualizar la informacion de un empleado
emplo.patch("/:id([0-9]{1,3})", async(req, res) => {
    const {nombre, apellidos, telefono, email, direccion, estado, admin, password, confirmPassword} = req.body;
    if(!nombre && !apellidos && !telefono && !email && !direccion && !estado && !admin && !password && !confirmPassword) return res.status(200).json({ code: 500, message: "Campos incompletos" });
    let rows;
    try{
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], "debugkey");
        const query = "SELECT admin FROM empleados WHERE idEmpleado = "+decoded.idEmpleado+" AND password = '"+hash(confirmPassword)+"'";
        rows = await db.query(query);
        if(rows[0].admin != 1) return res.status(200).json({ code: 409, message: "No tienes autorización para realizar esta operacion" });
    } catch(e){
        return res.status(200).json({ code: 409, message: "Ocurrio un error al verificar la autenticidad del usuario" });
    }
    try {
        //Campos a Actualizar
        if(email){
            let query = `UPDATE empleados SET nombre='${nombre}', apellidos='${apellidos}', telefono='${telefono}', email='${email}', direccion='${direccion}', estado='${estado}', admin='${admin}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if(password){
            let query = `UPDATE empleados SET password='${hash(password)}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
            console.log(rows);
        }
        if(rows.affectedRows != 1) return res.status(200).json({ code: 500, message: "Ocurrio un error" });
    }catch(e){
        console.log(e);
        return res.status(200).json({ code: 500, message: "Ocurrio un error" });
    }
    return res.status(200).json({ code: 200, message: "Se actualizo la información del empleado correctamente"});
});

emplo.delete("/:id([0-9]{1,3})", async(req, res) => {
    try {
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], "debugkey");
        const pass = req.body.password;
        if(!pass) return res.status(200).json({ code: 409, message: "Falta una confirmación por contraseña para realizar la operación" });

        let query = `SELECT admin FROM empleados WHERE idEmpleado=${decoded.idEmpleado} AND password = '${hash(pass)}'`;
        let rows = await db.query(query);
        if(rows[0].admin != 1) return res.status(200).json({ code: 409, message: "Te faltan permisos para realizar esta operación" });

        //Eliminar empleado por ID
        query = `DELETE FROM empleados WHERE idEmpleado=${req.params.id}`;
        rows = await db.query(query);
        if (rows.affectedRows == 1) 
        {
            return res.status(200).json({ code: 200, message: "Empleado Borrado Correctamente" })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({ code: 409, message: "La contraseña proporcionada no corresponde con el usuario administrador" });
    }
    return res.status(200).json({ code: 404, message: "Empleado no encontrado" });
});

module.exports = emplo;