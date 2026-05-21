import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
        select: false
    },
    name: {
        type: String,
        required: [true, 'Please provide name']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const adminModel = mongoose.model('Admin', adminSchema)

export default adminModel
