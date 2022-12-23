import app from './server.js'
import mongoDB from 'mongodb'
import dotenv from 'dotenv'
import UsersDAO from './dao/usersDAO.js'
import PostsDAO from './dao/postsDAO.js'
import mongoose from 'mongoose'
dotenv.config()
const MongoClient = mongoDB.MongoClient

const port = process.env.PORT || 5000

mongoose.connect(
    process.env.CARBUILDS_DB_URI, {
    maxPoolSize: 50,
}, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}).catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client =>{
    app.listen(port, ()=>{
        console.log(`listening on port ${port}`)
    })
})
