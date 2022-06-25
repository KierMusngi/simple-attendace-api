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
        required: false
    },
    right: {
        type: String,
        required: false
    },
    bottom: {
        type: String,
        required: false
    },
    top: {
        type: String,
        required: false
    },
    extra: {
        type: Object,
        required: true
    }
});

export const RegisteredFaces = mongoose.model('RegisteredFaces', registeredFacesSchema);
