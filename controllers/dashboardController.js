import express from "express";
import { Employee } from "../models/employee.js";
import { TimeLog } from "../models/timeLog.js";
import { getPairedLogs, groupByEmployeeId, groupByTimeLog, pairLogs } from "../utilities/dailyTimeRecordUtil.js";

const dashboardController = express.Router();

const getRecentAttendees = async () => {
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
        return new Date(b.timeIn) - new Date(a.timeIn);
    });

    var topAttendees = sortedDailyTimeRecords.sort((a,b) => b-a).slice(0,5);

    return topAttendees;
}

const getEmployeeCount = async () => {
    return await Employee.count();
}

const getOnTimeCount = () => {
    return 50;
}

const getLateCount = () => {
    return 25;
}

const getAbsentCount = () => {
    return 10;
}
// GET: http://localhost:3000/dashboard/counts
dashboardController.get('/counts', async (req, res) => {
    try {
        const employeeCount = await getEmployeeCount();
        const topAttendees = await getRecentAttendees();
        const onTimeCount = getOnTimeCount();
        const lateCount = getLateCount();
        const absentCount = getAbsentCount();

        res.status(200).json({
            employeeCount: employeeCount,
            onTimeCount: onTimeCount,
            lateCount: lateCount,
            absentCount: absentCount,
            topAttendees
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default dashboardController;
