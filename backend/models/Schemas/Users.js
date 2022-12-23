import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UsersSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    about: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    vehicles: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Vehicle'
    }],
    posts: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Post'
    }],
    twitter: {
        type: String,
    },
    instagram: {
        type: String,
    },
    youtube: {
        type: String,
    },
})

export default mongoose.model('User', UsersSchema)