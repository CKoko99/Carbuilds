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
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    profilePicture: {
        type: String,
    }
    ,
})

UsersSchema.virtual('vehiclesData', {
    ref: 'Vehicle',
    localField: 'vehicles',
    foreignField: '_id'
});


export default mongoose.model('User', UsersSchema)