
import { Typography, Box, Button, CircularProgress } from '@material-ui/core'
import Profilecard from "../Posts/ProfileCard";
import caravi from './CBmycar.png'
import cbpost from './CBpost.jpeg'
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

import { useParams } from "react-router-dom";

import { Avatar } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import FollowComponent from "./FollowComponent/FollowComponent";
import FollowListModal from "./FollowListModal/FollowListModal";
import EditProfileModal from './EditProfileModal/EditProfileModal';
import NewVehicleModal from '../Ui/Modals/NewVehicleModal';
import DeleteVehicleModal from '../Ui/Modals/DeleteVehicleModal';

import ClearIcon from '@mui/icons-material/Clear';

const User = {
    username: "Kokokrispy",
    avatar: caravi,
    desc: "Car enthusiast from Houston, lover of gas guzzling german or japanese machines.",
    site: '',
    Vehicles: [
        {
            id: 1,
            year: 2008,
            make: 'BMW',
            model: '335i'
        },
        {
            id: 2,
            year: 1996,
            make: 'Nissan',
            model: '240sx'
        },
    ],
    Posts: [
        {
            id: 1,
            title: '18 Inch ESR SR05',
            likes: 18,
            pics: [cbpost],
            desc: "18 inch bronze ESR SR05s fitted on my e92.",
            vehicleId: 1,
            comments: []
        },
        {
            id: 2,
            title: 'Custom Widebody Mold',
            likes: 87,
            pics: ["https://i.imgur.com/v7yPDWf.jpg",
                "https://i.imgur.com/FFeDoCE.jpg",
                "https://i.imgur.com/O8iMicr.jpg",],
            desc: "Custom Widebody for my Nissan 240sx",
            vehicleId: 2,
            comments: [{ id: 1, userId: 1, username: "bendett", text: "Yoooooo" }]
        },
    ]
}


const useStyles = makeStyles({
    socialIcons: {
        color: 'black',
        fontSize: "2.5rem",
    },
});


function Profile() {
    const classes = useStyles();
    const { paramId } = useParams();
    const [profileData, setProfileData] = useState()
    const [usersVehicles, setUsersVehicles] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [postsComments, setPostsComments] = useState([])
    const authSelector = useSelector(state => state.auth)
    const { sendRequest } = useHttpClient()
    const currentUser = paramId === authSelector.userId ? true : false
    const [errorFetchingProfile, setErrorFetchingProfile] = useState(false)
    const [profileDataLoading, setProfileDataLoading] = useState(true)


    const getVehiclesHandler = useCallback(async () => {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/vehicles/${paramId}`, 'GET', null, {
                'Content-Type': 'application/json'
            });
            if (!responseData.error) {
                setUsersVehicles(responseData.vehiclesList);
            }
        } catch (err) {
            // handle error
        }
    }, [sendRequest, paramId, setUsersVehicles]);

    const getPostsHandler = useCallback(async () => {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/posts/user/${paramId}`, 'GET', null, {
                'Content-Type': 'application/json'
            });
            console.log(responseData);
            if (!responseData.error) {
                setUserPosts(responseData.postList);
            }
        } catch (err) {
            // handle error
        }
    }, [sendRequest, paramId, setUserPosts]);

    const getUserByIdHandler = useCallback(async (userId) => {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`, 'GET', null, {
                'Content-Type': 'application/json'
            });

            return responseData;
        } catch (e) {
            console.log(e);
        }
    }, [sendRequest]);

    const getCommentsHandler = useCallback(async (postId) => {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/comments/${postId}`, 'GET', null, {
                'Content-Type': 'application/json'
            });

            return responseData;
        } catch (e) {
            console.log(e);
        }
    }, [sendRequest]);


    useEffect(() => {
        async function fetchComments() {

            const Comments = [];
            if (userPosts.length > 0) {
                for (let i = 0; i < userPosts.length; i++) {
                    if (userPosts[i].comments.length > 0) {
                        const subComments = { postId: userPosts[i]._id, comments: [] };
                        let postComments = await getCommentsHandler(userPosts[i]._id);
                        for (let j = 0; j < postComments.length; j++) {
                            let user = await getUserByIdHandler(postComments[j].creator);
                            let commentObj = { username: user.username, userId: postComments[j].creator, text: postComments[j].text };
                            subComments.comments.push(commentObj);
                        }
                        Comments.push(subComments);
                    }
                }
            }
            console.log(Comments);
            setPostsComments(Comments);
        }

        if (userPosts.length > 0) {
            fetchComments();
        }
    }, [userPosts, sendRequest, getCommentsHandler, getUserByIdHandler]);


    const getUserData = useCallback(async () => {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/${paramId}`, "GET", null, {
                "Content-Type": "application/json"
            });
            console.log(responseData);
            if (responseData.error) {
                setErrorFetchingProfile(true);
                return null;
            } else {
                return responseData;
            }
        } catch (err) {
            setErrorFetchingProfile(true);
        }
    }, [paramId, sendRequest, setErrorFetchingProfile]);
    const fetchData = useCallback(async () => {
        const userData = await getUserData();
        console.log("userData");
        console.log(userData);
        setProfileData(userData);
        setProfileDataLoading(false);
        getVehiclesHandler();
        getPostsHandler();
    }, [getUserData, getPostsHandler, getVehiclesHandler])
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const Posts = userPosts.map((post, index) => {
        let matchingCar
        if (post.vehicle) {
            matchingCar = usersVehicles.find(car => car._id === post.vehicle)
        }
        let commentsForPost = postsComments.find(section => section.postId === post._id)
        if (matchingCar) {
            return <Profilecard key={index}
                reload={getPostsHandler}
                timeAgo={post.timeAgo}
                postid={post._id} comments={commentsForPost}
                title={post.title} vehicle={matchingCar}
                username={profileData.username} description={post.description}
                likes={post.likes} imgs={User.Posts[0].pics} />
        } else {
            return <Profilecard key={index}
                reload={getPostsHandler}
                timeAgo={post.timeAgo}
                postid={post._id} comments={commentsForPost}
                title={post.title} username={profileData.username}
                description={post.description} likes={post.likes}
                imgs={User.Posts[0].pics} />
        }
    })


    function updateFollowersArray(newFollowersArray) {
        //copy current profile data
        const updatedProfileData = { ...profileData }
        //update followers array
        updatedProfileData.followers = newFollowersArray
        //set profile data to updated profile data
        setProfileData(updatedProfileData)
    }

    const [openFollowModal, setOpenFollowModal] = useState(false)

    function openFollowModalHandler(mode) {
        setOpenFollowModal(mode)
        console.log("clicked")
    }
    function closeFollowModalHandler() {
        setOpenFollowModal(false)
    }

    const [editProfile, setEditProfile] = useState(false)

    function openEditProfileHandler() {
        setEditProfile(true)
    }
    function closeEditProfileHandler() {
        setEditProfile(false)
    }
    function reloadUserData() {
        fetchData();
        closeEditProfileHandler();
    }

    const [openNewVehcielModal, setOpenNewVehcielModal] = useState(false)

    function openNewVehcielModalHandler() {
        setOpenNewVehcielModal(true)
    }
    function closeNewVehicleModalHandler() {
        setOpenNewVehcielModal(false)
    }
    function reloadVehicles() {
        getVehiclesHandler();
        closeNewVehicleModalHandler();
    }
    const [deleteVehicleModal, setDeleteVehicleModal] = useState(false)
    const [vehicleToDelete, setVehicleToDelete] = useState(null)
    
    function openDeleteVehicleModalHandler(vehicle) {
        setVehicleToDelete(vehicle)
        setDeleteVehicleModal(true)
    }
    function closeDeleteVehicleModalHandler() {
        setDeleteVehicleModal(false)
    }
    function closeAndRefreshDeletedVehicleHandler() {
        closeDeleteVehicleModalHandler()
        getVehiclesHandler()
    }
    return <>
        {errorFetchingProfile && "No Profile Found"}
        {profileDataLoading && <CircularProgress />}
        {profileData && <>
            <Box sx={{
                marginTop: 15,
                flexDirection: 'row',
                alignItems: 'flex-start',
                borderLeft: "1px solid #676767",
                borderRight: "1px solid #676767",
                margin: "20px auto",
                minWidth: "300px",
                maxWidth: "1035px",
                padding: "2.5% 3.5% 2.5% 3.5%",
                backgroundColor: "white",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                width: "85%",
                display: { xs: "block", sm: "flex" },
            }}>
                <Box sx={{ width: { xs: '90%', sm: '25%' }, margin: { xs: "auto", sm: 0 } }}>
                    <Typography variant="h4" component="h1" gutterBottom> {profileData.username} </Typography>
                    <Avatar alt="avatar" src={profileData.profilePicture} sx={{ width: "14rem !important", height: "14rem !important", display: "block" }} />
                </Box>
                <Box sx={{ width: { xs: '90%', sm: '50%' }, margin: "10px auto" }}>
                    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                        <Box sx={{ display: { xs: "block", sm: "flex" }, fontSize: "1rem" }}>
                            <Box sx={{ marginRight: "4px" }}>
                                <Typography variant="h6" sx={{ fontSize: "1rem", }}> {profileData.posts.length} </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontSize: "1rem", }}>Posts </Typography>
                        </Box>
                        <Box onClick={() => { openFollowModalHandler("Followers") }} sx={{ display: { xs: "block", sm: "flex" } }}>
                            <Box sx={{ marginRight: "4px" }}>
                                <Typography variant="h6" sx={{ fontSize: "1rem", }}> {profileData.followers.length}</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontSize: "1rem", }}> Followers </Typography>
                        </Box>
                        <Box onClick={() => { openFollowModalHandler("Following") }} sx={{ display: { xs: "block", sm: "flex" } }}>
                            <Box sx={{ marginRight: "4px" }}>
                                <Typography variant="h6" sx={{ fontSize: "1rem", }}> {profileData.following.length} </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontSize: "1rem", }}> Following </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: { xs: "center", sm: "left" }, mt: 1, mb: 1, }}>
                        {currentUser && <Button variant="contained" onClick={openEditProfileHandler}>Edit Profile</Button>}
                        {!currentUser && <FollowComponent followsUpdated={updateFollowersArray} followers={profileData.followers} userId={paramId} />}
                    </Box>
                    <Box sx={{ textAlign: { xs: "center", sm: "left" }, mt: 1, mb: 1, }}>
                        <Typography > {profileData.about} </Typography>
                    </Box>
                    <Box sx={{ textAlign: { xs: "center", sm: "left" }, mt: 1, mb: 1, }}>
                        {profileData.twitter && profileData.twitter.length > 0 && (<a target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} href={"https://twitter.com/" + profileData.twitter}><TwitterIcon className={classes.socialIcons} /> </a>)}
                        {profileData.instagram && profileData.instagram.length > 0 && (<a target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} href={"https://instagram.com/" + profileData.instagram}><InstagramIcon className={classes.socialIcons} /> </a>)}
                        {profileData.youtube && profileData.youtube.length > 0 && (<a target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} href={"https://youtube.com/" + profileData.youtube}><YouTubeIcon className={classes.socialIcons} /></a>)}
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontSize: "1rem", }}>Vehicles</Typography>
                        <Box>
                            {usersVehicles.map((vehicle, index) => {
                                return <Button key={index}> {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                    <ClearIcon onClick={() => { openDeleteVehicleModalHandler(vehicle) }} style={{ cursor: 'pointer' }} />
                                </Button>
                            })}
                            {currentUser && <Button onClick={openNewVehcielModalHandler} >Add New Vehicle</Button>}
                        </Box>
                    </Box>
                </Box>

            </Box>
            {editProfile && <EditProfileModal

                close={closeEditProfileHandler}
                submit={reloadUserData}
                open={openEditProfileHandler}
                profileData={profileData}
                userId={paramId}
            />}
            {openFollowModal && <FollowListModal
                followersList={profileData.followers}
                followingList={profileData.following}
                modalTab={openFollowModal}
                user={paramId}
                close={closeFollowModalHandler}
                open={openFollowModal}
            />}
            {openNewVehcielModal && <NewVehicleModal
                close={closeNewVehicleModalHandler}
                open={openNewVehcielModal}
                closeAndRefresh={reloadVehicles}
            />}
            {deleteVehicleModal && <DeleteVehicleModal
                close={closeDeleteVehicleModalHandler}
                open={deleteVehicleModal}
                vehicle={vehicleToDelete}
                closeAndRefresh={closeAndRefreshDeletedVehicleHandler}
            />}
        </>
        }
        <div className={classes['posts']}>

            <div className={classes['posts-title']}>Posts</div>
            {Posts}
        </div>
        <div className={classes['']}></div>
    </>
}


export default Profile