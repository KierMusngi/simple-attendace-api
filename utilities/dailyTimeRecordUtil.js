export const pairLogs = (timeLogs, employee) => {
    const sortedTimeLogs = timeLogs.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
    });

    const timeIn = sortedTimeLogs[0];
    const timeOut = sortedTimeLogs.slice(-1)[0] != sortedTimeLogs[0]
        ? sortedTimeLogs.slice(-1)[0]
        : ' ';

    return {
        id: Math.floor(100000 + Math.random() * 900000),
        employeeId: timeIn.employeeId,
        employeeName: employee.name,
        employeePosition: employee.position,
        timeIn: timeIn.time,
        timeOut: timeOut.time, 
        totalHours: new Date(timeOut.time).getHours() - new Date(timeIn.time).getHours()
    };
};

export const getPairedLogs = (timeLogs, employee) => {
    const groupedByTimeLog = groupByTimeLog(timeLogs);
    const pairedLogs = groupedByTimeLog.map((a) => {
        return pairLogs(a.timeLogs, employee);
    });

    return pairedLogs;
};

export const groupByTimeLog = (timeLogs) => {
    const groups = timeLogs.reduce((groups, log) => {
        const date = log.time.split(' ')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(log);
        return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
        return { date, timeLogs: groups[date] };
    });

    return groupArrays;
};

export const groupByEmployeeId = (timeLogs) => {
    const groups = timeLogs.reduce((groups, log) => {
        const employeeId = log.employeeId;
        if (!groups[employeeId]) {
            groups[employeeId] = [];
        }
        groups[employeeId].push(log);
        return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((employeeId) => {
        return { employeeId, timeLogs: groups[employeeId] };
    });

    return groupArrays;
};
