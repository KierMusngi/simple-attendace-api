import mongoose from "mongoose";

const timeLogsSchema = mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

export const TimeLog = mongoose.model('TimeLog', timeLogsSchema);
