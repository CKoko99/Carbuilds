import jwt from 'jsonwebtoken'
import HttpError from '../models/httpError.js'


export default function (req, res, next) {
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