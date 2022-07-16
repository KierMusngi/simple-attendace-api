import express from "express";
import { RegisteredFaces } from "../models/registeredFaces.js";
import { TimeLog } from '../models/timeLog.js';
import { Employee } from '../models/employee.js';
import { Notification } from "../models/notification.js";
import { getDateTimeNow } from '../utilities/dateTimeUtil.js';
import { getPairedLogs } from "../utilities/dailyTimeRecordUtil.js";

import axios from "axios";

const androidController = express.Router();

var maxIntruderTrial = 5;
var intruderTrialCount = 0;

const getRecentTimein = async (employee) => {
    const dtrs = await TimeLog.find({ employeeId: `${employee._id}`});
    const pairedLogs = getPairedLogs(dtrs, employee);
    const recentTimein = new Date(pairedLogs[pairedLogs.length-1].timeIn);
    const minsToAdd = 30;
    const futureDate = new Date(recentTimein.getTime() + minsToAdd*60000);
    return futureDate;
};

const openGate = async () => {
    await axios.get('http://192.168.1.100/open-gate')
        .then(res => {
            console.log(res.data);
        })
        .catch(e => {
            console.log(e);
        });
};

const activateAlarm = async () => {
    await axios.get('http://192.168.1.100/alarm')
        .then(res => {
            console.log(res.data);
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
            intruderTrialCount = 0;
            await activateAlarm();

            const notification = new Notification({
                message: "Intruder Detected",
                time: getDateTimeNow()
            });
            
            try {
                await notification.save();
            } catch (err) {
                console.log(err.message);
            }
        }
        return res.status(400).json({ message: 'Cannot find employee' })
    };

    const registeredFace = await RegisteredFaces.findOne({ name: name });
    if (!registeredFace) return res.status(400).json({ message: 'Face is not registered' });

    try {
        const recent = await getRecentTimein(employee);
        console.log(recent);
        const dateNow = getDateTimeNow();

        if (new Date(dateNow) > new Date(recent)){
            const dtr = new TimeLog({
                employeeId: employee._id,
                time: dateNow
            });

            await dtr.save();
            await openGate();
            console.log("Open gate");
            intruderTrialCount = 0;
            res.status(201).json({message: "Door opened"});
        }
        else {
            res.status(200).json({message: 'Next time in should be in 30 minutes'});
        }

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
