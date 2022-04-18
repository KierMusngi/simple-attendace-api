import express from "express";
import { User } from "../models/user.js";
import jwt from 'jsonwebtoken';
import { verifyToken } from "../utilities/verifyToken.js";

const authController = express.Router();

authController.get('/', verifyToken, async (req, res) => {
    res.status(200).json({ id: req.userId, auth: true, message: "Congratulations! you're authenticated"});
});

authController.post('/', async (req, res) => {
    const {
        userName,
        password
    } = req.body;

    try {
        const user = await User.findOne({ userName: userName})
        if (user.password != password) {
            res.status(401).json({message: "Password did not match"});
        } else {
            const userId = user._id;
            const token = jwt.sign({userId}, process.env.JWT_SECRET, {
                expiresIn: 300
            });

            res.status(200).json({ auth: true, token: token });
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default authController;