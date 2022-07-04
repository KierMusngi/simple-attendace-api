import express from "express";
import { RegisteredFaces } from "../models/registeredFaces.js";
import { TimeLog } from '../models/timeLog.js';
import { Employee } from '../models/employee.js';
import { getDateTimeNow } from '../utilities/dateTimeUtil.js';
import axios from "axios";

const androidController = express.Router();

var maxIntruderTrial = 3;
var intruderTrialCount = 0;

const openGate = async () => {
    await axios.get('http://192.168.1.100/open-gate')
        .then(res => {
            console.log(res);
        })
        .catch(e => {
            console.log(e);
        });
};

const triggerAlarm = async () => {
    await axios.get('http://192.168.1.100/alarm')
        .then(res => {
            console.log(res);
        })
        .catch(e => {
            console.log(e);
        });
};

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
    console.log(name);

    const employee = await Employee.findOne({ name: name });
    if (!employee) {
        console.log("Intruder Alert!");
        intruderTrialCount++;
        if (intruderTrialCount >= maxIntruderTrial){
            console.log("Alarm System!");
            // await triggerAlarm();
            intruderTrialCount = 0;
        }
        return res.status(400).json({ message: 'Cannot find employee' })
    };

    const registeredFace = await RegisteredFaces.findOne({ name: name });
    if (!registeredFace) return res.status(400).json({ message: 'Face is not registered' });

    try {
        const dtr = new TimeLog({
            employeeId: employee._id,
            time: getDateTimeNow()
        });

        await dtr.save();
        // await openGate();
        console.log("Open gate");
        intruderTrialCount = 0;
        res.status(201).json({message: "Door opened"});
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

        if (!employeeExist) {
            await employee.save();    
        }

        const newRegisteredFace = await registeredFace.save();

        res.status(201).json({ newRegisteredFace});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default androidController;
