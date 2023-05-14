import PostsDAO from '../dao/postsDAO.js'
import bucket from '../googleCloud/bucket.js';

export default class PostsController {
    static async apiCreatePost(req, res, next) {
        try {
            const files = req.files;
            const { userId } = req.params;
            const caption = req.body.caption || "TEST CAPTION";
            console.log(userId)
            const URLS = [];
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                const blob = bucket.file(files[i].originalname);
                const blobWriter = blob.createWriteStream();
                const promise = new Promise((resolve, reject) => {
                    blobWriter.on("finish", async () => {
                        // Assembling public URL for accessing the file via HTTP
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        URLS.push(publicUrl);
                        resolve();
                    });
                    blobWriter.on("error", reject);
                });
                promises.push(promise);
                blobWriter.end(files[i].buffer);
            }
            await Promise.all(promises);
            console.log(URLS);
            const result = await PostsDAO.createPost(userId, caption, URLS);
            res.json(result);
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: e.message })
        }
    }
    static async apiGetPosts(req, res, next) {
        const { postsList, totalPosts } = await PostsDAO.getPosts()

        let response = { postsList, totalPosts }
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
    static async apiLikePost(req, res, next) {
        const postData = await PostsDAO.likePost(req.params.id, req.body.userId)

        res.json(postData)
    }
}