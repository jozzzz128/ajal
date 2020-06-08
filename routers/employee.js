const express = require('express');
const emplo = express.Router();
const db = require('../config/database');
const hash = require('../middleware/hash');

//Mostrar la informacion 
emplo.get("/", async (req, res) => {
    const query = "SELECT nombre, apellidos, telefono, email, direccion, estado FROM empleados";
    const rows = await db.query(query);
    return res.status(200).json({ code:200, message: rows});
});

//Actualizar la informacion de un empleado
emplo.patch("/:id([0-9]{1,3})", async(req, res) => {
    const {nombre, apellidos, telefono, email, direccion, estado, admin, password} = req.body;
    if(!nombre && !apellidos && !telefono && !email && !direccion && !estado && !admin && !password) return res.status(500).json({ code: 500, message: "Campos incompletos" });
    let rows;
    try {
        //Campos a Actualizar
        if(nombre){
            let query = `UPDATE empleados SET nombre='${nombre}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if(apellidos){
            let query = `UPDATE empleados SET apellidos='${apellidos}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if(telefono){
            let query = `UPDATE empleados SET telefono='${telefono}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if (email){
            let query = `UPDATE empleados SET email='${email}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if(direccion){
            let query = `UPDATE empleados SET direccion='${direccion}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if(estado){
            let query = `UPDATE empleados SET estado='${estado}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if(admin){
            let query = `UPDATE empleados SET admin='${admin}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if(password){
            let query = `UPDATE empleados SET password='${hash(password)}' WHERE idEmpleado=${req.params.id};`;
            rows = await db.query(query);
        }
        if(rows.affectedRows != 1) return res.status(200).json({ code: 500, message: "Ocurrio un error" });
    }catch(e){
        console.log(e);
        return res.status(200).json({ code: 500, message: "Ocurrio un error" });
    }
    return res.status(200).json({ code: 200, message: "Campos actualizados correctamente"});
});

emplo.delete("/:id([0-9]{1,3})", async(req, res) => {
    const query = `DELETE FROM empleados WHERE idEmpleado=${req.params.id}`
    const rows = await db.query(query);
    if (rows.affectedRows == 1) 
    {
        return res.status(200).json({ code: 200, message: "Empleado Borrado Correctamente" })
    }
    return res.status(200).json({ code: 404, message: "Empleado no encontrado" });
});


module.exports = emplo;