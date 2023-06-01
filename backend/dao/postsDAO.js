import e, { response } from 'express'
import User from '../models/Schemas/Users.js'
import Post from '../models/Schemas/Posts.js'
import Comment from '../models/Schemas/Comments.js'
import Vehichle from '../models/Schemas/Vehicles.js'
import mongoose from 'mongoose'

import mongoDB from 'mongodb'
import HttpError from '../models/httpError.js'

const ObjectID = mongoDB.ObjectId

let posts

export default class PostsDAO {

    static async createPost(userId, caption, links, vehicleId) {
        let existingUser
        try {
            existingUser = await User.findById(userId)
        } catch (e) {
            console.error(`Unable to find user: ${e}`)
            return { error: e }
        }
        if (!existingUser) {
            throw new HttpError("Unable to find user for post")
        }


        try {
            const post = new Post({
                title: caption,
                creator: userId,
                description: caption,
                images: links,
                likes: [],
                comments: [],
                vehicle: vehicleId ? vehicleId : null
            })
            await post.save()
            existingUser.posts.push(post)
            await existingUser.save()
            return { message: "Post Created" }
        } catch (e) {
            console.error(`Unable to create post: ${e}`)
            return { error: e }
        }

    }
    static async getPosts() {
        let query
        let cursor

        try {
            cursor = await Post.find().cursor()
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { postsList: [], totalPosts: 0 }
        }

        const postsList = []
        const totalPosts = await Post.countDocuments(query)

        try {
            await cursor.forEach((post) => {
                postsList.push(post)
            })
            return { postsList, totalPosts }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { postsList: [], totalPosts: 0 }
        }
    }

    static async getPost(id) {
        let thePost
        try {
            thePost = await Post.findById(id)
        } catch (e) {
            console.error("Error fetching post")
            return { error: e.message }
        }
        if (!thePost) {
            console.log("here we are")
            throw new HttpError("Couldn't find Post")
        } else {
            return thePost
        }
    }
    static async getUserPosts(id) {
        let userPosts;
        try {
            userPosts = await Post.find({ creator: id }).sort({ createdAt: -1 });
        } catch (e) {
            console.error(`Unable to find Posts: ${e}`);
            return { error: { message: e.message, code: e.code } };
        }

        const postList = userPosts.map((post) => {
            const postObject = post.toObject();
            postObject.timeAgo = post.timeAgo();
            return postObject;
        });

        return { postList, totalPosts: postList.length };
    }
    static async likePost(post, userId) {
        let thePost
        try {
            thePost = await Post.findById(post)
        } catch (e) {
            console.error(`Unable to find Posts: ${e}`)
            return { error: { message: e.message, code: e.code } }
        }
        if (!thePost) {
            throw new HttpError("Unable to find Post to like")
        } else {
            let userMatch
            try {
                userMatch = await User.findById(userId)
                if (!userMatch) {
                    throw new HttpError("Could not find user to create Vehicle", 422)
                } else {
                    let userInLike = thePost.likes.find(user => user.toString() === userMatch._id.toString())
                    if (!userInLike) {
                        thePost.likes.push(userMatch)
                    } else {
                        thePost.likes.pull(userInLike)
                    }
                    thePost.save()
                    return thePost
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
