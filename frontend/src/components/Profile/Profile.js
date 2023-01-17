import classes from "./Profile.module.css";
import { Modal, Typography, Box, Button } from '@material-ui/core'
import Profilecard from "../Posts/ProfileCard";
import Vehicle from "../Ui/vehicle/vehicle";
import EditProfile from "../Ui/Modals/EditProfile";

import caravi from './CBmycar.png'
import cbpost from './CBpost.jpeg'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import { authActions } from "../../store/store";

import twitterIcon from '../../icons/socials/twitter.png'
import instagramIcon from '../../icons/socials/instagram.png'
import youtubeIcon from '../../icons/socials/youtube.png'
import { useParams } from "react-router-dom";
import LinkModal from "../Ui/Modals/LinkModal";
import NewVehicleModal from "../Ui/Modals/NewVehicleModal";
import { Avatar } from "@mui/material";
import { height, width } from "@mui/system";


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





function Profile() {
    const { paramId } = useParams();
    const [profileData, setProfileData] = useState()
    const [usersVehicles, setUsersVehicles] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [postsComments, setPostsComments] = useState([])
    const [editProfile, setEditProfile] = useState(false)
    const [twitterModal, setTwitterModal] = useState(false)
    const [instagramModal, setInstagramModal] = useState(false)
    const [youtubeModal, setYoutubeModal] = useState(false)
    const [vehicleModal, setVehicleModal] = useState(false)
    const authSelector = useSelector(state => state.auth)
    const authDispatch = useDispatch(authActions)
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const currentUser = paramId === authSelector.userId ? true : false
    async function getUserData() {
        let responseData
        try {
            responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/user/' + paramId, "GET", null, {
                'Content-Type': 'application/json'
            })
            if (responseData.error) {
                return null
            } else {
                return responseData
            }
        } catch (err) {

        }
    }
    async function getVehiclesHandler() {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/vehicles/' + paramId, 'GET', null, {
                'Content-Type': 'application/json'
            })
            if (!responseData.error) {
                setUsersVehicles(responseData.vehiclesList)
            }

        } catch (err) {
        }
    }
    async function getPostsHandler() {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/posts/user/' + paramId, 'GET', null, {
                'Content-Type': 'application/json'
            })
            if (!responseData.error) {
                setUserPosts(responseData.postList)
            }
        } catch (err) {
        }
    }
    async function getCommentsHandler(postId) {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/comments/' + postId, 'GET', null, {
                'Content-Type': 'application/json'
            })
            return responseData
        } catch (e) {
            console.log(e)
        }
    }
    async function getUserByIdHandler(userId) {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/user/' + userId, 'GET', null, {
                'Content-Type': 'application/json'
            })
            return responseData
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(async () => {
        const Comments = []
        if (userPosts.length > 0) {
            for (let i = 0; i < userPosts.length; i++) {
                if (userPosts[i].comments.length > 0) {
                    const subComments = { postId: userPosts[i]._id, comments: [] }
                    let postComments = await getCommentsHandler(userPosts[i]._id)
                    for (let j = 0; j < postComments.length; j++) {
                        let user = await getUserByIdHandler(postComments[j].creator)
                        let commentObj = { username: user.username, userId: postComments[j].creator, text: postComments[j].text }
                        subComments.comments.push(commentObj)
                    }
                    Comments.push(subComments)
                }
            }
        }
        console.log(Comments)
        setPostsComments(Comments)
    }, [userPosts])
    useEffect(async () => {
        const userData = await getUserData()
        console.log("userData")
        console.log(userData)
        setProfileData(userData)
        getVehiclesHandler()
        getPostsHandler()
    }, [])
    const Vehicles = usersVehicles.map(car => {
        return <div style={{ paddingRight: '.5em' }}><Vehicle key={car.id} year={car.year} make={car.make} model={car.model} /></div>
    })
    const Posts = userPosts.map(post => {
        let matchingCar
        if (post.vehicle) {
            matchingCar = usersVehicles.find(car => car._id === post.vehicle)
        }
        let commentsForPost = postsComments.find(section => section.postId === post._id)
        if (matchingCar) {
            return <Profilecard reload={getPostsHandler} key={post.id} postid={post._id} comments={commentsForPost} title={post.title} vehicle={matchingCar} username={profileData.username} description={post.description} likes={post.likes} imgs={User.Posts[0].pics} />
        } else {
            return <Profilecard reload={getPostsHandler} key={post.id} postid={post._id} comments={commentsForPost} title={post.title} username={profileData.username} description={post.description} likes={post.likes} imgs={User.Posts[0].pics} />
        }
    })
    async function submitVehicleHandler(vehicleobject) {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/vehicles', 'POST', JSON.stringify({
                userId: authSelector.userId,
                model: vehicleobject.model,
                year: vehicleobject.year,
                make: vehicleobject.make
            }), {
                'Content-Type': 'application/json'
            })
            closeNewVehicleModalHandle()
        } catch (err) {
        }
        getVehiclesHandler()
    }
    function openEditProfileHandler() {
        setEditProfile(true)
    }
    function closeEditProfileHandler() {
        setEditProfile(false)
    }
    function openTwitterModalHandler() {
        setTwitterModal(true)
    }
    function closeTwitterModalHandler() {
        setTwitterModal(false)
    }
    function openInstagramModalHandler() {
        setInstagramModal(true)
    }
    function closeInstagramModalHandler() {
        setInstagramModal(false)
    }
    function openYoutubeModalHandler() {
        setYoutubeModal(true)
    }
    function closeYoutubeModalHandler() {
        setYoutubeModal(false)
    }
    function openNewVehicleModalHandle() {
        setVehicleModal(true)
    }
    function closeNewVehicleModalHandle() {
        setVehicleModal(false)
    }

    return <>
        {profileData ? (<>
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

                <Box sx={{ width: { xs: '90%', sm: '25%' }, margin: { xs: "auto", sm: 0} }}>
                    <Typography variant="h4" component="h1" gutterBottom> {profileData.username} </Typography>
                    <Avatar alt="avatar" src={User.avatar} className={classes.large} sx={{ width: "100%", height: "100%" }} />
                </Box>
                <Box sx={{ width: { xs: '90%', sm: '50%' }, margin: "10px auto"}}>
                    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                        <Box sx={{ display: { xs: "block", sm: "flex" }, fontSize: "1rem" }}>
                            <Box sx={{ marginRight: "4px" }}>
                                <Typography variant="h6" sx={{fontSize: "1rem",}}> 3 </Typography>
                            </Box>
                            <Typography variant="h6" sx={{fontSize: "1rem",}}>Posts </Typography>
                        </Box>
                        <Box sx={{ display: { xs: "block", sm: "flex" } }}>
                            <Box sx={{ marginRight: "4px" }}>
                                <Typography variant="h6" sx={{fontSize: "1rem",}}> 3 </Typography>
                            </Box>
                            <Typography variant="h6" sx={{fontSize: "1rem",}}> Followers </Typography>
                        </Box>
                        <Box sx={{ display: { xs: "block", sm: "flex" } }}>
                            <Box sx={{ marginRight: "4px" }}>
                                <Typography variant="h6" sx={{fontSize: "1rem",}}> 3 </Typography>
                            </Box>
                            <Typography variant="h6" sx={{fontSize: "1rem",}}> Following </Typography>
                        </Box>
                    </Box>
                    <Box sx={{textAlign: {xs: "center", sm: "left"}, mt: 1, mb: 1,}}>
                        <Button variant="contained" onClick={openEditProfileHandler}>Edit Profile</Button>
                    </Box>
                    <Box sx={{textAlign: {xs: "center", sm: "left"}, mt: 1, mb: 1,}}>
                        <Typography > {profileData.about} </Typography>
                    </Box>
                    <Box sx={{textAlign: {xs: "center", sm: "left"}, mt: 1, mb: 1,}}>
                        {profileData.twitter && profileData.twitter.length > 0 && (<a target="_blank" href={"https://twitter.com/" + profileData.twitter}><img src={twitterIcon}/> </a>)}
                        {profileData.instagram && profileData.instagram.length > 0 && (<a target="_blank" href={"https://instagram.com/" + profileData.instagram}><img src={instagramIcon}/> </a>)}
                        {profileData.youtube && profileData.youtube.length > 0 && (<a target="_blank" href={"https://youtube.com/" + profileData.youtube}><img src={youtubeIcon}/> </a>)}
                    </Box>
                </Box>
            </Box>
            END
            <div className={classes['Profile']}>
                <div className={classes['username']}>{profileData.username}</div>
                {currentUser && ("true")}
                <div className={classes['profile-avi-div']}>
                    <img alt="avatar" src={User.avatar} />
                </div>
                {currentUser && (
                    <button onClick={openEditProfileHandler}>Edit Profile</button>
                )}
                {editProfile && <EditProfile user={profileData} close={closeEditProfileHandler} />}
                <div className={classes['profile-desc']}>{profileData.about}</div>
                {(() => {
                    if (currentUser) {
                        return <>
                            {profileData.twitter && profileData.twitter.length > 0 && (<a target="_blank" href={"https://twitter.com/" + profileData.twitter}>
                                <img src={twitterIcon} />
                            </a>
                            )}
                            {profileData.instagram && profileData.instagram.length > 0 && (<a target="_blank" href={"https://instagram.com/" + profileData.instagram}>
                                <img src={instagramIcon} />
                            </a>
                            )}
                            {profileData.youtube && profileData.youtube.length > 0 && (<a target="_blank" href={profileData.youtube}>
                                <img src={youtubeIcon} />
                            </a>
                            )}
                        </>
                    }
                    else {
                        return <>
                            {profileData.twitter && profileData.twitter.length > 0 && (<>
                                <img src={twitterIcon} onClick={openTwitterModalHandler} />
                                {twitterModal && (<LinkModal close={closeTwitterModalHandler} link={"https://twitter.com/" + profileData.twitter} />)}
                            </>

                            )}
                            {profileData.instagram && profileData.instagram.length > 0 && (
                                <>
                                    <img src={instagramIcon} onClick={openInstagramModalHandler} />
                                    {instagramModal && (<LinkModal close={closeInstagramModalHandler} link={"https://instagram.com/" + profileData.instagram} />)}
                                </>
                            )}
                            {profileData.youtube && profileData.youtube.length > 0 && (
                                <>
                                    <img src={youtubeIcon} onClick={openYoutubeModalHandler} />
                                    {youtubeModal && (<LinkModal close={closeYoutubeModalHandler} link={profileData.youtube} />)}
                                </>
                            )}
                        </>

                    }

                })()}
                <div className={classes['vehicles-div']}>

                    {Vehicles.length > 1 && (<div className={classes['vehicles-title']}>Vehicles</div>)}
                    {Vehicles.length < 2 && (<div className={classes['vehicles-title']}>Vehicle</div>)}
                    <hr />
                    <div className={classes['vehicles']}>
                        {Vehicles}
                        {currentUser && (<>
                            <div onClick={openNewVehicleModalHandle} className={classes['add-vehicle']}>Add New Vehicle</div>
                            <Button onClick={openNewVehicleModalHandle}>Add New Vehicle</Button>
                        </>)
                        }
                        {vehicleModal && (<>
                            <Modal
                                open={vehicleModal}
                                onClose={closeNewVehicleModalHandle}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Text in a modal
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                                    </Typography>
                                </Box>
                            </Modal>
                        </>) /*(<NewVehicleModal close={closeNewVehicleModalHandle} submitVehicle={submitVehicleHandler} />)*/}
                        {httpError}
                    </div>
                </div>
                <div className={classes['posts']}>

                    <div className={classes['posts-title']}>Posts</div>
                    {Posts}
                </div>
                <div className={classes['']}></div>
            </div>
        </>) :
            (<div>User Not Found</div>)
        }
    </>
}
export default Profile