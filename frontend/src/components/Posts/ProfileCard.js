import { useRef, useState, useEffect } from "react";
import classes from "./Posts.module.css";

import Vehicle from "../Ui/vehicle/vehicle";

import heart from '../../icons/Ui/filledheart.png'
import emptyheart from '../../icons/Ui/unfilledheart.png'


import { useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import { Box, Typography, TextField, Button, Link } from "@material-ui/core";
import Image from 'mui-image'
import SwipeableViews from 'react-swipeable-views';
import { MobileStepper } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";


function Profilecard(props) {

    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const commentRef = useRef()
    const authSelector = useSelector(state => state.auth)
    const [postData, setPostData] = useState({
        title: "",
        description: "",
        likes: [],
        comments: [],
        imgs: [],
        images: [],
        vehicle: "",
        creator: {username: "", userId: ""},
    })
    //useEffect to get the post data
    useEffect(() => {
        retrievePostData()
    }, [])
    async function retrievePostData() {
        try {
            const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/posts/' + props.postid)
            //add test image to response data
            responseData.imgs = ["https://i.imgur.com/v7yPDWf.jpg"]
            //retrieve user name from id in response data
            const userResponse = await sendRequest('http://localhost:5001/api/v1/carbuilds/user/' + responseData.creator)
            responseData.creator = {username: userResponse.username, userId: responseData.creator}
            setPostData(responseData)
        } catch (e) {
            console.log(e)
        }
    }

    async function likePostHandler() {

        try {
            const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/post/like/' + props.postid, 'POST', JSON.stringify({
                userId: authSelector.userId
            }), {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + authSelector.token
            })
            
            const getResponse = await sendRequest('http://localhost:5000/api/v1/carbuilds/posts/' + props.postid)

            let newPostData = postData
            newPostData.likes = getResponse.likes
            setPostData(newPostData)
            handleLikes(newPostData.likes)
        } catch (e) {
            console.log(e)
        }
    }

    const [isLiked, setIsLiked] = useState(false)
    const [likesText, setLikesText] = useState("Be the first to like this!")


    function handleLikes(likesArray){
        //check if user liked
        if (likesArray.find(user => user === authSelector.userId)) {
            setIsLiked(true)
        } else {
            setIsLiked(false)
        }
        //set likes text
        if(likesArray.length > 1) {
            setLikesText(likesArray.length + " likes")
        }
        else if (likesArray.length == 1) {
            setLikesText(likesArray.length + " like")
        }else{
            setLikesText("Be the first to like this!")
        }
    }

    useEffect(() => {
        handleLikes(postData.likes)
    }, [postData.likes])
   

    let comments
    if (postData.comments.comments) {
        comments = postData.comments.comments.map((comment, index) => {
            return <div key={index} className={classes['comment']}><a href={"/profile/" + comment.userId}><span style={{ fontWeight: "bold" }}> {comment.username}-</span></a> {comment.text}</div>
        })
    }
    /*if (postData.imgs.length == 1) {
        //props.imgs.push("https://i.imgur.com/v7yPDWf.jpg")
    }*/
    
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = postData.images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    async function submitCommentHandler() {
        console.log(commentRef.current.value)
        if (commentRef.current.value.length > 0) {
            console.log("eh1")
            try {
                console.log("eh2")
                const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/comment/' + props.postid, 'POST', JSON.stringify({
                    userId: authSelector.userId,
                    text: commentRef.current.value,
                }), {
                    'Content-Type': 'application/json'
                })
                console.log("eh")
                console.log(responseData)
            } catch (e) {
                console.log(e)
            }
            commentRef.current.value = ""
            props.reload()
        }
    }

    return (<>
        <Box sx={{
            textAlign: "left",
            border: "1px solid #676767",
            boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "95%",
                margin: "0.5em auto"
            }}>
                <Link href={"/post/" + props.postid}>
                    {postData.title}
                </Link>
            </Box>
            <Box>

                <SwipeableViews
                    axis={'x'}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                    containerStyle={{ alignItems: "center" }}
                >
                    {postData.images.map((step, index) => (
                        <div key={step}>
                            {Math.abs(activeStep - index) <= 2 ? (
                                <Box
                                    component="img"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        width: '100%',
                                    }}
                                    src={step}
                                />
                            ) : null}
                        </div>
                    ))}
                </SwipeableViews>

                {postData.images.length > 1 &&
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                            style={{ visibility: activeStep === maxSteps -1 ? "hidden" : "visible"}}
                        >
                            
                            {<KeyboardArrowRight />}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0} 
                        style={{
                            visibility: activeStep === 0 ? "hidden" : "visible"
                        }} >

                            {<KeyboardArrowLeft />}

                            
                        </Button>
                    }
                />}
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "95%",
                margin: "0.5em auto 0"
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row"
                }}>
                    {isLiked ? 
                    <Image onClick={likePostHandler} src={heart} alt="heart" width={"1.2em"} /> :
                    <Image onClick={likePostHandler} src={emptyheart} alt="heart" width={"1.2em"} />
                 } <Typography style={{ marginLeft: "0.5em" }} variant="subtitle1" component="span">{likesText}</Typography>
                    
                </Box>
                {postData.vehicle && (<div className={classes['vehicle']}><Vehicle year={props.vehicle.year} model={props.vehicle.model} make={props.vehicle.make} /></div>)}
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                width: "95%",
                margin: "0.5em auto"
            }}>
                <Typography variant="subtitle1" ><Box component="span" fontWeight='fontWeightBold'>{postData.creator.username} - </Box> {postData.description}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "0.5em" }}>
                    <TextField id="standard-basic" label="Leave a comment..." variant="standard" inputRef={commentRef} />
                    <Button variant="contained" onClick={submitCommentHandler}>Post</Button>
                </Box>
            </Box>
        </Box>
       </>
    )
}

export default Profilecard