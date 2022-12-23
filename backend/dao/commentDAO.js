import User from '../models/Schemas/Users.js'
import Post from '../models/Schemas/Posts.js'
import Comment from '../models/Schemas/Comments.js'
import HttpError from '../models/httpError.js'
import mongoose from 'mongoose'

export default class vehicleDAO {
    static async getPostComment(postId) {
        let comments
        try {
            comments = await Comment.find({ post: postId })
        } catch (error) {

        }
        const transComments = comments.map(comment => comment.toObject())
        return transComments

    }
    static async getCommentById(commentId) {
        let singleComment
        try {
            singleComment = await Comment.findById(commentId)
        } catch (error) {
        }
        console.log("singleComment")
        console.log(singleComment)
        return singleComment

    }
    static async postComment(postId, userId, text) {
        let existingUser
        try {
            existingUser = await User.findById(userId)
        } catch (e) {

        }
        if (!existingUser) {
            throw new HttpError("Couldn't find user to make comment")
        }
        let existingPost
        try {
            existingPost = await Post.findById(postId)
        } catch (e) {
        }
        if (!existingPost) {
            throw new HttpError("Couldn't find post to make comment")
        }

        const newComment = new Comment({
            creator: userId,
            text,
            post: postId
        })

        const sess = await mongoose.startSession()
        sess.startTransaction()
        await newComment.save({ session: sess })
        existingPost.comments.push(newComment)
        await existingPost.save({ session: sess })
        await sess.commitTransaction()
        return newComment
    }
}