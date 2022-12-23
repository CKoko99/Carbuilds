import CommentDAO from '../dao/commentDAO.js'

export default class VehciclesController {
    static async apiGetComments(req, res, next) {
        try {
            const postData = await CommentDAO.getPostComment(req.params.postId)
            res.json(postData)

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
    static async apiGetCommentById(req, res, next) {
        try {
            console.log(req.params.commentId)
            const postData = await CommentDAO.getCommentById(req.params.commentId)
            res.json(postData)

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
    static async apiPostComment(req, res, next){
        try {
            const {userId, text} = req.body
            const postData = await CommentDAO.postComment(req.params.postId, userId, text)
            res.json(postData)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}