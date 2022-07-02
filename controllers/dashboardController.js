import express from "express";
import { Employee } from "../models/employee.js";
import { TimeLog } from "../models/timeLog.js";
import { groupByEmployeeId, groupByTimeLog, pairLogs } from "../utilities/dailyTimeRecordUtil.js";
import { getDateTimeInRequirement } from '../utilities/dateTimeUtil.js';

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

const getOnTimeCount = async () => {
    var date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    const logs = await TimeLog.find({ time: new RegExp(date) });
    const groupedByEmployeeId = groupByEmployeeId(logs);
    const dailyTimeRecords = [];
    await Promise.all(groupedByEmployeeId.map(async (a) => {
        const employee = await Employee.findById(a.employeeId);
        const groupedByTimeLog = groupByTimeLog(a.timeLogs);
        groupedByTimeLog.map(b => {
            dailyTimeRecords.push(pairLogs(b.timeLogs, employee));
        });
    }));

    var onTimeCount = 0;
    var timeInReq = getDateTimeInRequirement();

    dailyTimeRecords.some(dtr => {
        var dtrDate = new Date(dtr.timeIn);
        var requiredTimeIn = new Date(timeInReq);
        if (dtrDate <= requiredTimeIn) onTimeCount++;
    });

    return onTimeCount;
}

const getLateCount = async () => {
    var date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    const logs = await TimeLog.find({ time: new RegExp(date) });
    const groupedByEmployeeId = groupByEmployeeId(logs);
    const dailyTimeRecords = [];
    await Promise.all(groupedByEmployeeId.map(async (a) => {
        const employee = await Employee.findById(a.employeeId);
        const groupedByTimeLog = groupByTimeLog(a.timeLogs);
        groupedByTimeLog.map(b => {
            dailyTimeRecords.push(pairLogs(b.timeLogs, employee));
        });
    }));

    var lateCount = 0;
    var timeInReq = getDateTimeInRequirement();

    dailyTimeRecords.some(dtr => {
        var dtrDate = new Date(dtr.timeIn);
        var requiredTimeIn = new Date(timeInReq);
        if (dtrDate >= requiredTimeIn) lateCount++;
    });

    return lateCount;
}

const getAbsentCount = async () => {
    var date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    const logs = await TimeLog.find({ time: new RegExp(date) });
    const groupedByEmployeeId = groupByEmployeeId(logs);
    const dailyTimeRecords = [];
    await Promise.all(groupedByEmployeeId.map(async (a) => {
        const employee = await Employee.findById(a.employeeId);
        const groupedByTimeLog = groupByTimeLog(a.timeLogs);
        groupedByTimeLog.map(b => {
            dailyTimeRecords.push(pairLogs(b.timeLogs, employee));
        });
    }));

    var employees = await Employee.find();
    var absentCount = 0;

    employees.forEach(employee => {
        var isFound = dailyTimeRecords.some(dtr => {
            if (dtr.employeeId == employee._id) return true;
            return false;
        });

        if(!isFound){
            absentCount++;
        };
    });

    return absentCount;
}

// GET: http://localhost:3000/dashboard/counts
dashboardController.get('/counts', async (req, res) => {
    try {
        const employeeCount = await getEmployeeCount();
        const topAttendees = await getRecentAttendees();
        const onTimeCount = await getOnTimeCount();
        const lateCount = await getLateCount();
        const absentCount = await getAbsentCount();

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
