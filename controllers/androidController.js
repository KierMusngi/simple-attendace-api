import express from "express";
import { RegisteredFaces } from "../models/registeredFaces.js";
import { TimeLog } from '../models/timeLog.js';
import { Employee } from '../models/employee.js';
import { getDateTimeNow } from '../utilities/dateTimeUtil.js';

const androidController = express.Router();

androidController.get('/', async (req, res) => {
    try {
        const registeredFaces = await RegisteredFaces.find();
        res.status(200).send(registeredFaces);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

androidController.post('/punch', async (req, res) => {
    const { name } = req.body;

    const employee = await Employee.findOne({ name: name });
    if (!employee) return res.status(400).json({ message: 'Cannot find employee' });

    const registeredFace = await RegisteredFaces.findOne({ name: name });
    if (!registeredFace) return res.status(400).json({ message: 'Face is not registered' });

    try {
        const dtr = new TimeLog({
            employeeId: employee._id,
            time: getDateTimeNow()
        });

        const newDtr = await dtr.save();
        res.status(201).json(newDtr);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

androidController.post('/register', async (req, res) => {
    try {
        const { name, position, id, title, distance, location, left, right,
            bottom, top, extra } = req.body;
        
        const registeredFace = new RegisteredFaces({ name, id, title, distance,
            location, left, right, bottom, top, extra });
        
        const employee = new Employee({ name, position });

        const employeeExist = await Employee.findOne({name: name})

        if (employeeExist) {
            res.status(400).json("Employee already exists");
            return;
        }

        const newRegisteredFace = await registeredFace.save();
        const newEmployee = await employee.save();

        res.status(201).json({ newRegisteredFace, newEmployee });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default androidController;
