import express from "express";
import { User } from "../models/user.js";

const usersController = express.Router();

const findUser = async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ message: 'Cannot find user' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
};

// GET: http://localhost:3000/users
usersController.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET: http://localhost:3000/users/:id
usersController.get('/:id', findUser, (req, res) => {
    res.status(200).json(res.user);
});

// POST: http://localhost:3000/users
usersController.post('/', async (req, res) => {
    const {
        userName,
        password,
        name,
        role
    } = req.body;

    const user = new User({
        userName,
        password,
        name,
        role
    });
    
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// TODO: Implement once needed
// PUT: http://localhost:3000/users/:id
// usersController.put('/:id', findUser, async (req, res) => {
//     res.user.name = req.body.name;
//     res.employee.position = req.body.position;

//     try {
//         const updatedEmployee = await res.employee.save();
//         res.status(200).send(updatedEmployee);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// DELETE: http://localhost:3000/users/:id
usersController.delete('/:id', findUser, async (req, res) => {
    try {
        await res.user.remove();
        res.status(200).json({ message: 'Deleted user'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default usersController;
