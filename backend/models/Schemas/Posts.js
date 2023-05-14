import mongoose from 'mongoose'

const Schema = mongoose.Schema

const PostsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    description: {
        type: String,
        required: true
    },
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref: "Vehicle"
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Comment'
    }],
    images: [{
        type: String,
        required: true
    }]
})

export default mongoose.model('Post', PostsSchema)