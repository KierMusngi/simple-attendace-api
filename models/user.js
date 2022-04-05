import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

export const User = mongoose.model('User', userSchema);
