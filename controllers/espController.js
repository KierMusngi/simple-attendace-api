import express from "express";

const espController = express.Router();

// POST: http://localhost:3000/esp
espController.post('/', async (req, res) => {
    try {
        console.log(req.body);
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

export default espController;