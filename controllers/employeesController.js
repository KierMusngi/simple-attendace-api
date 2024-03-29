import express from "express";
import { Employee } from '../models/employee.js';
import { TimeLog } from "../models/timeLog.js";
import { RegisteredFaces } from "../models/registeredFaces.js";

const employeesController = express.Router();

const findEmployee = async (req, res, next) => {
    let employee;
    try {
        employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(400).json({ message: 'Cannot find employee' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

    res.employee = employee;
    next();
};

// GET: http://localhost:3000/employees
employeesController.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).send(employees);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET: http://localhost:3000/employees/count
employeesController.get('/count', async (req, res) => {
    try {
        const employeeCount = await Employee.count();
        res.status(200).json({ count: employeeCount });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET: http://localhost:3000/employees/:id
employeesController.get('/:id', findEmployee, (req, res) => {
    res.status(200).json(res.employee);
});

// POST: http://localhost:3000/employees
employeesController.post('/', async (req, res) => {
    const { name, position } = req.body;

    const employee = new Employee({
        name,
        position
    });
    
    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// PUT: http://localhost:3000/employees/:id
employeesController.put('/:id', findEmployee, async (req, res) => {
    res.employee.name = req.body.name;
    res.employee.position = req.body.position;

    try {
        const updatedEmployee = await res.employee.save();
        res.status(200).send(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: http://localhost:3000/employees/:id
employeesController.delete('/:id', findEmployee, async (req, res) => {
    try {
        await TimeLog.find({ employeeId: res.employee._id}).deleteMany();
        await RegisteredFaces.find({name: res.employee.name}).deleteMany();
        await res.employee.remove();

        res.status(200).json({ message: 'Deleted employee'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default employeesController;