import mongoose from "mongoose";

const registeredFacesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    left: {
        type: String,
        required: true
    },
    right: {
        type: String,
        required: true
    },
    bottom: {
        type: String,
        required: true
    },
    top: {
        type: String,
        required: true
    },
    extra: {
        type: Object,
        required: true
    }
});

export const RegisteredFaces = mongoose.model('RegisteredFaces', registeredFacesSchema);