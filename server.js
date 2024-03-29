import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import employeesController from './controllers/employeesController.js';
import timeLogsController from './controllers/timeLogsController.js';
import dailyTimeRecordsController from './controllers/dailyTimeRecordsController.js';
import usersController from './controllers/usersController.js';
import authController from './controllers/authController.js';
import espController from './controllers/espController.js';
import androidController from './controllers/androidController.js';
import dashboardController from './controllers/dashboardController.js';
import notificationsController from './controllers/notificationsController.js';

mongoose.connect(process.env.CONNECTION_STRING);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// controllers
app.use('/employees', employeesController);
app.use('/time-logs', timeLogsController);
app.use('/daily-time-records', dailyTimeRecordsController);
app.use('/users', usersController);
app.use('/login', authController);
app.use('/esp', espController);
app.use('/android', androidController);
app.use('/dashboard', dashboardController);
app.use('/notifications', notificationsController);

const port = 8080;
app.listen(port, () => console.log(`Server started http://localhost:${port}`));