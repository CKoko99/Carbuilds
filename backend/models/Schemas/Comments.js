import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CommentsSchema = new Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post"
    }
})

export default mongoose.model('Comment', CommentsSchema)