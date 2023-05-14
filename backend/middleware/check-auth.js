import jwt from 'jsonwebtoken'
import HttpError from '../models/httpError.js'


export function checkAuthMiddleWare(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        console.log("token" + req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            throw new Error("Authentication Fail")
        }
        const decodedToken = jwt.verify(token, 'supersecret_dont_share')
        req.userData = { userId: decodedToken.userId }
        console.log("passed auth")
        return next()
    } catch (e) {
        console.log("auth Error")
        console.log(e.message)
        const error = new HttpError("Authentication Failed", 401)
        return next(error)
    }

}

export function checkToken(req, res, next) {
    console.log("here")
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const userId = req.params.id
        console.log("token" + req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            throw new Error("Authentication Fail")
        }
        const decodedToken = jwt.verify(token, 'supersecret_dont_share')
        if (decodedToken.userId !== userId) { // check if decoded token userId matches request parameter userId
            throw new Error("Invalid Token")
        }
        req.userData = { userId: decodedToken.userId }
        console.log("passed auth")
        return res.status(200).json({ valid: true })
    } catch (e) {
        console.log("auth Error")
        console.log(e.message)
        return res.status(401).json({ valid: false })
    }

}