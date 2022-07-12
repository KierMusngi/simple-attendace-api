import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

export const Notification = mongoose.model('Notification', notificationSchema);
