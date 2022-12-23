import PostsDAO from '../dao/postsDAO.js'

export default class PostsController {
    static async apiCreatePost(req, res, next) {
        try {
            const {title, description, userId, vehicle} = req.body

            const PostResponse = await PostsDAO.createPost(
                userId, title, description, vehicle
            )
            res.status(200).json(PostResponse)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
    static async apiGetPosts(req, res, next) {
        const { postsList, totalPosts } = await PostsDAO.getPosts()

        let response = {postsList, totalPosts}
            res.json(response)
    }
    static async apiGetPost(req, res, next) {
        const postData = await PostsDAO.getPost(req.params.id)

        console.log("postData")
        console.log(postData)
        res.json(postData)
    }
    static async apiGetUserPosts(req, res, next) {
        const postData = await PostsDAO.getUserPosts(req.params.id)

        res.json(postData)
    }
    static async apiLikePost(req, res,next){
        const postData = await PostsDAO.likePost(req.params.id, req.body.userId)

        res.json(postData)
    }
}