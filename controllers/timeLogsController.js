import express from 'express';
import { getDateTimeNow } from '../utilities/dateTimeUtil.js';
import { TimeLog } from '../models/timeLog.js';
import { Employee } from '../models/employee.js';

const timeLogsController = express.Router();

// GET: http://localhost:3000/time-logs
timeLogsController.get('/', async (req, res) => {
    try {
        const dtrs = await TimeLog.find();
        res.status(200).send(dtrs);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET: http://localhost:3000/time-logs/:id
timeLogsController.get('/:id', async (req, res) => {
    try {
        const dtr = await TimeLog.findById(req.params.id);
        if (!dtr) return res.status(400).json({ message: 'Cannot find time log' });
        res.status(200).send(dtr);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: http://localhost:3000/time-logs
timeLogsController.post('/', async (req, res) => {
    const { employeeId } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(400).json({ message: 'Cannot find employee' });

    try {
        const dtr = new TimeLog({
            employeeId,
            time: getDateTimeNow()
        });

        const newDtr = await dtr.save();
        res.status(201).json(newDtr);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

export default timeLogsController;