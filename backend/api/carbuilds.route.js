import express from 'express'
import userCTRL from './users.controller.js'
import postCTRL from './posts.controller.js'
import commentCTRL from './comment.controller.js'
import vehicleCTRL from './vehicles.controller.js'
import {checkAuthMiddleWare, checkToken} from '../middleware/check-auth.js'
import fileupload from '../middleware/file-upload.js'
const router = express.Router()

router.route('').get((req, res) => { res.send("hello world") })

router
    .route('/users')
    .get(userCTRL.apiGetUsers)
    .post(fileupload.single('imgfile') ,userCTRL.apiCreateUser)

router.route('/users/avatar/:id').post(fileupload.single('image'), userCTRL.apiUploadProfilePicture);

router.route('/users/login').post(userCTRL.apiLoginUser)
router.route('/user/:id').get(userCTRL.apiGetUserById)
router.route('/user/auth/:id').get(checkToken)


//route to get users followers
router.route('/user/:id/followers').get(userCTRL.apiGetUserFollowers)
//route to get users following
router.route('/user/:id/following').get(userCTRL.apiGetUserFollowing)

router.route('/posts').get(postCTRL.apiGetPosts).post(postCTRL.apiCreatePost)
router.route('/posts/:id').get(postCTRL.apiGetPost)
router.route('/posts/user/:id').get(postCTRL.apiGetUserPosts)

router.route('/comments/:postId').get(commentCTRL.apiGetComments)
router.route('/comment/:commentId').get(commentCTRL.apiGetCommentById)

router.route('/vehicles/:id').get(vehicleCTRL.apiGetVehiclesByUserId)
router.route('/vehicles').post(vehicleCTRL.apiCreateVehicle).get(vehicleCTRL.apiGetVehicles)
router.route('/comment/:postId').post(commentCTRL.apiPostComment)
router.use(checkAuthMiddleWare)

router.route('/post/like/:id').post(postCTRL.apiLikePost)
router.route('/posts/:userId').post(fileupload.array('images', 5), postCTRL.apiCreatePost)
router.route('/user/update/:id').patch(userCTRL.apiUpdateProfile)
router.route('/user/:id/follow').post(userCTRL.apiFollowUser).delete(userCTRL.apiUnfollowUser)



export default router