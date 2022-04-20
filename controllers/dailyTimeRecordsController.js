import express from "express";
import { Employee } from "../models/employee.js";
import { TimeLog } from "../models/timeLog.js";
import { getPairedLogs, groupByEmployeeId, groupByTimeLog, pairLogs } from "../utilities/dailyTimeRecordUtil.js";

const dailyTimeRecordsController = express.Router();

// GET: http://localhost:3000/daily-time-records
dailyTimeRecordsController.get('/', async (req, res) => {
    try {
        const logs = await TimeLog.find();
        const groupedByEmployeeId = groupByEmployeeId(logs);

        const dailyTimeRecords = [];
        await Promise.all(groupedByEmployeeId.map(async (a) => {
            const employee = await Employee.findById(a.employeeId);

            const groupedByTimeLog = groupByTimeLog(a.timeLogs);
            groupedByTimeLog.map(b => {
                dailyTimeRecords.push(pairLogs(b.timeLogs, employee));
            });
        }));

        const sortedDailyTimeRecords = dailyTimeRecords.sort((a, b) => {
            return new Date(a.timeIn) - new Date(b.timeIn);
        });

        res.status(200).send(sortedDailyTimeRecords);
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
        const pairedLogs = getPairedLogs(dtrs, employee);
        res.status(200).send(pairedLogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default dailyTimeRecordsController;
