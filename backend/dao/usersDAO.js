import User from '../models/Schemas/Users.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { response } from 'express'
import mongoDB from 'mongodb'
import HttpError from '../models/httpError.js'

const ObjectID = mongoDB.ObjectId
let users

export default class UsersDAO {
    /*
    static async injectDB(conn) {
        if (users) {
            return
        }
        try {
            users = await conn.db(process.env.CARBUILDS_NS).collection("users")
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
            return { error: {message: e.message, code: e.code}}
        }
    }*/
    static async createUser(email, username, password, next) {
        let usernameMatch
        let emailMatch
        try {
            usernameMatch = await User.findOne({ username: username })
            emailMatch = await User.findOne({ email: email })
            if (usernameMatch) {
                throw new HttpError("Username is already taken", 422)
            }
            if (emailMatch) {
                throw new HttpError("Email is already taken", 422)
            }
            let hashedPassword
            try {
                hashedPassword = await bcrypt.hash(password, 12)

            } catch (e) {
                console.error(`Unable to create user: ${e}`)
                return { error: { message: e.message, code: e.code } }
            }
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                vehicles: [],
                about: "",
                posts: [],
                twitter: "",
                instagram: "",
                youtube: ""
            })
            let token
            try {
                token = jwt.sign({ userId: newUser.id, username: newUser.username }, 'supersecret_dont_share', { expiresIn: '1h' })
                await newUser.save()
            } catch (e) {
                console.error(`Unable to create user: ${e}`)
                return { error: { message: e.message, code: e.code } }
            }
            return { userId: newUser.id, username: newUser.username, token }
        } catch (e) {
            console.error(`Unable to create user: ${e}`)
            return { error: { message: e.message, code: e.code } }
        }
    }
    static async getUsers() {
        console.log("start")
        let usersList
        let cursor
        try {
            
            cursor = await User.find()
            usersList = cursor.map(user => user.toObject())
            return { usersList, totalUsers: usersList.length }
        } catch (e) {
            console.error(`Error: ${e}`)
            return { usersList: [], totalUsers: 0 }
        }
    }
    static async loginUser(username, password) {
        let existingUser
        try {
            existingUser = await User.findOne({ username: username })
        } catch (e) {
            console.error("Error Authenticating User")
            return { error: { message: "Error Authenticating User", code: 500 } }
        }
        try {
            if (existingUser) {
                let isValidPassword
                isValidPassword = await bcrypt.compare(password, existingUser.password)
                if (isValidPassword) {
                    let token
                    try {
                        token = jwt.sign({ userId: existingUser.id, username: existingUser.username }, 'supersecret_dont_share', { expiresIn: '1h' })
                    } catch (e) {
                        console.error(`Unable to sign in user: ${e}`)
                        return { error: { message: e.message, code: e.code } }
                    }
                    return { userId: existingUser.id, username: existingUser.username, token }
                } else {
                    throw new HttpError("Invalid Login Credentials Please Try Again", 401)
                }
            } else {
                throw new HttpError("Invalid Login Credentials Please Try Again", 401)
            }
        } catch (e) {
            return { error: { message: e.message, code: e.code } }
        }
    }
    static async getUserById(id) {
        let existingUser
        try {
            existingUser = await User.findById(id)
        } catch (e) {
            console.error("Error fetching User")
            return { error: { message: e.message, code: e.code } }
        }
        if (existingUser) {
            return {
                username: existingUser.username,
                vehicles: existingUser.vehicles,
                posts: existingUser.posts,
                about: existingUser.about,
                instagram: existingUser.instagram,
                youtube: existingUser.youtube,
                twitter: existingUser.twitter,
            }
        } else {
            return { error: { message: "No User Found", code: 422 } }
        }
    }
    static async updateProfile(id, about, twitter, instagram, youtube) {
        let existingUser
        try {
            existingUser = await User.findById(id)
        } catch (e) {
            console.error("Error fetching User")
            return { error: { message: e.message, code: e.code } }
        }
        if (existingUser) {
            existingUser.about = about
            existingUser.twitter = twitter
            existingUser.instagram = instagram
            existingUser.youtube = youtube

            try {
                await existingUser.save()
            } catch (e) {
                console.error("Error Saving Profile Data")
                return { error: { message: e.message, code: e.code } }
            }
        } else {
            return { error: { message: "No User Found", code: 422 } }
        }
        return { message: "success" }
    }

    static async followUser(userId, followUserId) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error('User not found');
        }
    
        const followUser = await this.getUser(followUserId);
        if (!followUser) {
          throw new Error('User to follow not found');
        }
    
        if (user.following.includes(followUserId)) {
          throw new Error('User already followed');
        }
    
        user.following.push(followUserId);
        followUser.followers.push(userId);
    
        await user.save();
        await followUser.save();
    
        return {
          following: user.following,
          followers: followUser.followers,
        };
      }
    
      static async unfollowUser(userId, unfollowUserId) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error('User not found');
        }
    
        const unfollowUser = await this.getUser(unfollowUserId);
        if (!unfollowUser) {
          throw new Error('User to unfollow not found');
        }
    
        if (!user.following.includes(unfollowUserId)) {
          throw new Error('User not followed');
        }
    
        user.following = user.following.filter((id) => id !== unfollowUserId);
        unfollowUser.followers = unfollowUser.followers.filter((id) => id !== userId);
    
        await user.save();
        await unfollowUser.save();
    
        return {
          following: user.following,
          followers: unfollowUser.followers,
        };
      }
}
