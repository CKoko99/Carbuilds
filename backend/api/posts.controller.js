
import { v4 as uuidv4 } from 'uuid';
import PostsDAO from '../dao/postsDAO.js'
import bucket from '../googleCloud/bucket.js';

export default class PostsController {
    static async apiCreatePost(req, res, next) {
        try {
            const files = req.files;
            const { userId } = req.params;
            const caption = req.body.caption || "TEST CAPTION";
            const options = {
                predefinedAcl: 'publicRead'
            };
            const vehicleId = req.body.vehicleId || null;
            console.log(userId);
            const URLs = [];
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Generate a unique file name using UUID
                const uniqueName = `${uuidv4()}-${file.originalname}`;

                const blob = bucket.file(uniqueName);
                const blobWriter = blob.createWriteStream({ ...options });

                const promise = new Promise((resolve, reject) => {
                    blobWriter.on("finish", async () => {
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        URLs.push(publicUrl);
                        resolve();
                    });
                    blobWriter.on("error", reject);
                });

                promises.push(promise);
                blobWriter.end(file.buffer);
            }

            await Promise.all(promises);
            console.log(URLs);

            const result = await PostsDAO.createPost(userId, caption, URLs, vehicleId);
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e.message });
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