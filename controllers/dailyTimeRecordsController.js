import express from "express";
import { Employee } from "../models/employee.js";
import { TimeLog } from "../models/timeLog.js";

const dailyTimeRecordsController = express.Router();

// GET: http://localhost:3000/daily-time-records
dailyTimeRecordsController.get('/', async (req, res) => {
    try {
        const dtrs = await TimeLog.find();
        res.status(200).send(dtrs);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET: http://localhost:3000/daily-time-records/:id
dailyTimeRecordsController.get('/:id', async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(400).json({ message: 'Cannot find employee' });

    try {
        const dtrs = await TimeLog.find({ employeeId: `${req.params.id}`});
        res.status(200).send(dtrs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default dailyTimeRecordsController;
