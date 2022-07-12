import express from "express";
import { Notification } from "../models/notification.js";
import { getDateTimeNow } from '../utilities/dateTimeUtil.js';

const notificationsController = express.Router();

// GET: http://localhost:3000/notifications
notificationsController.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).send(notifications);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// POST: http://localhost:3000/notifications
notificationsController.post('/', async (req, res) => {
    const { message } = req.body;

    const notification = new Notification({
        message,
        time: getDateTimeNow()
    });
    
    try {
        const newNotification = await notification.save();
        res.status(201).json(newNotification);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// DELETE: http://localhost:3000/notifications/:id
notificationsController.delete('/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        await notification.remove();

        res.status(200).json({ message: 'Deleted notification'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default notificationsController;
