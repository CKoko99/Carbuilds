import UsersDAO from '../dao/usersDAO.js'

export default class UsersController {
    static async apiCreateUser(req, res, next) {
        try {
            const email = req.body.email
            const username = req.body.username
            const password = req.body.password

            const UserResponse = await UsersDAO.createUser(
                email, username, password, next
            )
            console.log(UserResponse)
            if (UserResponse.error) {
                res.status(UserResponse.error.code).json(UserResponse.error)
            } else {
                res.json(UserResponse)
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
    static async apiGetUsers(req, res, next) {
        try {
            //Optional query parameters for a list of users
            if (req.body.users) {
                const { usersList, totalUsers } = await UsersDAO.getUsers(req.body.users)
                let response = { usersList, totalUsers }
                return res.json(response)
            } else {
                const { usersList, totalUsers } = await UsersDAO.getUsers()
                let response = { usersList, totalUsers }
                res.json(response)
            }
        } catch (error) {
            console.error(`Error while getting users: ${error}`)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
    static async apiLoginUser(req, res, next) {
        const username = req.body.username
        const password = req.body.password
        const userData = await UsersDAO.loginUser(username, password)
        if (userData.error) {
            res.status(userData.error.code).json(userData.error)
        } else {
            res.json(userData)
        }
    }

    static async apiGetUserById(req, res, next) {
        const userData = await UsersDAO.getUserById(req.params.id)
        res.json(userData)
    }
    static async apiUpdateProfile(req, res, next) {
        const { about, twitter, instagram, youtube } = req.body
        const userData = await UsersDAO.updateProfile(req.params.id, about, twitter, instagram, youtube)
        res.json(userData)
    }
    static async apiFollowUser(req, res, next) {
        try {
            const { id: userToFollow } = req.params;
            const userFollowing = req.body.userId;

            const result = await UsersDAO.followUser(userFollowing, userToFollow);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async apiUnfollowUser(req, res, next) {

        try {
            const { id: userToUnfollowing } = req.params;
            const userUnfollowing = req.body.userId;

            const result = await UsersDAO.unfollowUser(userUnfollowing, userToUnfollowing);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    static async apiGetUserFollowers(req, res, next) {
        try {
            const { id } = req.params;
            console.log(id)
            const result = await UsersDAO.getUsersFollowers(id);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    static async apiGetUserFollowing(req, res, next) {
        try {
            const { id } = req.params;

            const result = await UsersDAO.getUsersFollowing(id);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}