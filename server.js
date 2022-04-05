import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import employeesController from './controllers/employeesController.js';
import timeLogsController from './controllers/timeLogsController.js';
import dailyTimeRecordsController from './controllers/dailyTimeRecordsController.js';
import usersController from './controllers/usersController.js';

mongoose.connect(process.env.CONNECTION_STRING);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));

const app = express();
app.use(express.json());

// controllers
app.use('/employees', employeesController);
app.use('/time-logs', timeLogsController);
app.use('/daily-time-records', dailyTimeRecordsController);
app.use('/users', usersController);

app.listen(3000, () => console.log('Server started'));