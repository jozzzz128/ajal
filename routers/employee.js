const express = require('express');
const emplo = express.Router();
const db = require('../config/database');

//Mostrar la informacion 
emplo.get("/", async (req, res) => {
    const query = "SELECT * FROM empleados";
    const rows = await db.query(query);
    return res.status(200).json({ code:200, message: rows});
});

//Actualizar la informacion de un empleado
emplo.patch("/:id([0-9]{1,3})", async(req, res, next) => {
    if (req.body.atributo = 'nombre')
    {
        let query = `UPDATE empleados SET nombre='${req.body.nombre}' WHERE idEmpleado=${req.params.id};`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1)
        {
            return res.status(200).json({ code: 200, message: "Nombre de empleado actualizado correctamente"});
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    else if(req.body.atributo == 'apellidos'){
        let query = `UPDATE empleados SET apellidos='${req.body.apellidos}' WHERE idEmpleado=${req.params.id};`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1)
        {
            return res.status(200).json({ code: 200, message: "Nombre de empleado actualizado correctamente"});
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    else if(req.body.atributo == 'telefono'){
        let query = `UPDATE empleados SET telefono='${req.body.apellidos}' WHERE idEmpleado=${req.params.id};`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1)
        {
            return res.status(200).json({ code: 200, message: "Nombre de empleado actualizado correctamente"});
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    else if(req.body.atributo == 'email'){
        let query = `UPDATE empleados SET email='${req.body.email}' WHERE idEmpleado=${req.params.id};`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1)
        {
            return res.status(200).json({ code: 200, message: "Nombre de empleado actualizado correctamente"});
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    else if(req.body.atributo == 'email'){
        let query = `UPDATE empleados SET email='${req.body.email}' WHERE idEmpleado=${req.params.id};`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1)
        {
            return res.status(200).json({ code: 200, message: "Nombre de empleado actualizado correctamente"});
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    else if(req.body.atributo == 'direccion'){
        let query = `UPDATE empleados SET direccion='${req.body.direccion}' WHERE idEmpleado=${req.params.id};`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1)
        {
            return res.status(200).json({ code: 200, message: "Nombre de empleado actualizado correctamente"});
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    else if(req.body.atributo == 'estado'){
        let query = `UPDATE empleados SET estado='${req.body.estado}' WHERE idEmpleado=${req.params.id};`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1)
        {
            return res.status(200).json({ code: 200, message: "Nombre de empleado actualizado correctamente"});
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    else if(req.body.atributo == 'admin'){
        let query = `UPDATE empleados SET admin='${req.body.admin}' WHERE idEmpleado=${req.params.id};`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1)
        {
            return res.status(200).json({ code: 200, message: "Nombre de empleado actualizado correctamente"});
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

emplo.delete("/:id([0-9]{1,3})", async(req, res, next) => {
    const query = `DELETE FROM empleados WHERE idEmpleado=${req.params.id}`
    const rows = await db.query(query);
    if (rows.affectedRows == 1) 
    {
        return res.status(200).json({ code: 200, message: "Empleado Borrado Correctamente" })
    }
    return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
});


module.exports = emplo;