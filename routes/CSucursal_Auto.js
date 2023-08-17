import { Router } from "express";
import {limitGColecciones, limitPColecciones, limitDColecciones} from '../middleware/limit.js';
import bodyParser  from 'body-parser';
import { Collection, ObjectId } from 'mongodb';
import { con } from '../db/atlas.js';

const AppSucursal_Auto = Router();
let db = await con();

AppSucursal_Auto.get('/GetSucursal_Auto', limitGColecciones(), async (req, res) =>{
    if(!req.rateLimit) return;
    let sucursal_automovil = db.collection("sucursal_automovil");
    let result = await sucursal_automovil.find({}).sort( { _id: 1 } ).toArray();
    res.send(result)

})

AppSucursal_Auto.post('/PostSucursal_Auto', limitPColecciones(100, "sucursal_automovil"), async (req, res) =>{
    if(!req.rateLimit) return;
    let sucursal_automovil = db.collection("sucursal_automovil");

    try {
        let result = await sucursal_automovil.insertOne(req.body)
        res.send(`Data Enviada correctamente`);
      } catch (error) {
        res.send(`Error al guardar la data, _id ya se encuentra en uso`);
      }
})

AppSucursal_Auto.put('/PutSucursal_Auto', limitPColecciones(100, "sucursal_automovil"), async (req, res) =>{
    if(!req.rateLimit) return;
    let sucursal_automovil = db.collection("sucursal_automovil");
    const id = parseInt(req.query.id, 10);
    try {
        
        let result = await sucursal_automovil.updateOne({ _id: id }, { $set: req.body })
        if (result.modifiedCount > 0) {
            res.send("Documento actualizado correctamente");
        } else {
            res.send("El documento no pudo ser encontrado o no se realizaron cambios");
        }
      } catch (error) {
        res.send(`Error al Actualizar la data`);
      }
})

AppSucursal_Auto.delete('/DeleteSucursal_Auto', limitDColecciones(), async (req, res) =>{
    if(!req.rateLimit) return;
    let sucursal_automovil = db.collection("sucursal_automovil");
    const id = parseInt(req.body.id, 10);
    try {
        let result = await sucursal_automovil.deleteOne({ _id: id })
        if (result.deletedCount > 0) {
            res.send("Documento ha sido eliminado correctamente");
        } else {
            res.send("El documento no pudo ser encontrado o no se elimino el documento");
        }
      } catch (error) {
        res.send(`Error al Actualizar la data`);
      }
})

export default AppSucursal_Auto;