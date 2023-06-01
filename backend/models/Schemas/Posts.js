import mongoose from 'mongoose'
import moment from 'moment';

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
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

PostsSchema.methods.timeAgo = function () {
    return moment(this.createdAt).fromNow();
};

export default mongoose.model('Post', PostsSchema)