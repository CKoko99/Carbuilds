import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useHttpClient } from "../../hooks/http-hook"
import classes from "./Posts.module.css";

import Vehicle from "../Ui/vehicle/vehicle";
import heart from '../../icons/Ui/filledheart.png'
import emptyheart from '../../icons/Ui/unfilledheart.png'
import { useSelector } from "react-redux";


export default function Postpage(props) {
    const { paramId } = useParams()
    const [postData, setPostData] = useState()
    const [userData, setUserData] = useState()
    const [postComments, setPostsComments] = useState([])
    const [currentSlide, setCurrentSlide] = useState(1);
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const [userLiked, setUserLiked] = useState(false)
    const authSelector = useSelector(state => state.auth)
    const commentRef = useRef()
    async function likePostHandler() {
        try {
            const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/post/like/' + paramId, 'POST', JSON.stringify({
                userId: authSelector.userId
            }), {
                'Content-Type': 'application/json',
                Authorization: "Bearer "+ authSelector.token
            })
            console.log(responseData)
            getPostData()
        } catch (e) {
            console.log(e)
        }
    }
    let isLiked
    let heartimg
    useEffect(()=>{
        if(postData){
            let userliked = postData.likes.find(user => user === authSelector.userId)
            setUserLiked(userliked)
        }
    }, [postData])
    if (userLiked) {
        isLiked = true
        heartimg = <img style={{ paddingRight: ".5em" }} alt="heart" src={heart} onClick={likePostHandler} />
    } else {
        isLiked = false
        heartimg = <img alt="heart" style={{ paddingRight: ".5em" }} src={emptyheart} onClick={likePostHandler} />
    }
    async function getPostData() {
        try {
            const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/posts/' + paramId, 'GET', null, {
                'Content-Type': 'application/json'
            })
            if (!responseData.error) {
                console.log(responseData)
                setPostData(responseData)
                getUserData(responseData.creator, true)
                getCommentsHandler(paramId)
            }
        } catch (e) {

        }
    }
    async function getUserData(userId, state) {
        try {
            const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/user/' + userId, 'GET', null, {
                'Content-Type': 'application/json'
            })
            if (!responseData.error) {
                if (state) {
                    setUserData(responseData)
                } else {
                    return responseData
                }
            }
        } catch (e) {

        }
    }
    async function getCommentsHandler(commentId) {
        try {
            const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/comment/' + commentId, 'GET', null, {
                'Content-Type': 'application/json'
            })
            return responseData
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getPostData()
    }, [])
    useEffect(async () => {
        if (postData) {
            const Comments = []
            for (let i = 0; i < postData.comments.length; i++) {
                console.log("here")
                console.log(postData.comments[i])
                let postComment = await getCommentsHandler(postData.comments[i])
                console.log("postComment")
                console.log(postComment)
                console.log(postComment.creator)
                let user = await getUserData(postComment.creator)
                console.log("user")
                console.log(user)
                let commentObj = { username: user.username, text: postComment.text }
                Comments.push(commentObj)

            }
            setPostsComments(Comments)
            console.log(Comments)
        }
    }, [postData])
    function changeSlideHandler(n) {
        const newSlide = currentSlide + n;
        if (newSlide < 1) {
            setCurrentSlide(props.imgs.length);
        } else if (newSlide > props.imgs.length) {
            setCurrentSlide(1);
        } else {
            setCurrentSlide(newSlide);
        }
    }
    async function submitCommentHandler() {
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
    let counter = 0
    let slides
    const comments = postComments.map(comment => {
        return <div key={comment.id} className={classes['comment']}><span style={{ fontWeight: "bold" }}> {comment.username}-</span> {comment.text}</div>
    })

    if (props.imgs) {
        slides = props.imgs.map((img) => {
            counter++;
            if (counter === currentSlide) {
                return (
                    <div
                        key={img}
                        className={`${classes["mySlides"]} ${classes["chosen"]} ${classes["fade"]}`}
                    >
                        <span className={classes["helper"]}></span>
                        <img
                            src={img}
                            alt={img}
                            className={classes["slide-img"]}
                        />
                    </div>
                );
            } else {
                return (
                    <div key={img} className={`${classes["mySlides"]} ${classes["fade"]}`}>
                        <span className={classes["helper"]}></span>
                        <img
                            alt={props.title}
                            src={img.link}
                            className={classes["slide-img"]}
                        />
                    </div>
                );
            }
        });
    } else {
        if (props.imgs) {
            slides = <div
                key={props.imgs[0].title}
                className={`${classes["mySlides"]} ${classes["chosen"]} ${classes["fade"]}`}
            >
                <span className={classes["helper"]}></span>
                <img
                    src={props.imgs[0]}
                    alt={props.imgs[0].title}
                    className={classes["slide-img"]}
                />
            </div>
        }
    }
    return <>{postData && userData ? (<div className={classes['postcard']}>
        <div className={classes['top-section']}>
            <div className={classes['title']}>{postData.title}</div>
        </div>
        <div className={classes['slideshow-container']}>{slides}

            {props.imgs && (<><div
                className={classes.prev}
                onClick={() => {
                    changeSlideHandler(-1);
                }}
            >
                &#10094;
            </div>
                <div
                    className={classes.next}
                    onClick={() => {
                        changeSlideHandler(1);
                    }}
                >&#10095;</div></>)}
        </div>
        <div className={classes['likes-vehicle']}>
            <div className={classes['likes']}>{heartimg}{(postData.likes.length > 1) ? (postData.likes.length + " likes") : (postData.likes.length > 0) ? (postData.likes.length + " like") : "Be The First To Like"}</div>
            {postData.vehicle && (<div className={classes['vehicle']}><Vehicle year={postData.vehicle.year} model={postData.vehicle.model} make={postData.vehicle.make} /></div>)}
        </div>
        <div className={classes['text-sections']}>
            <div className={classes['description']}><span style={{ fontWeight: "bold" }}> {userData.username}-</span> {postData.description}</div>
            {comments}
            <div className={classes['comment']}>
                <input className={classes['comment-input']} ref={commentRef} placeholder="Leave A Comment..." />
                <button onClick={submitCommentHandler}>post comment</button>
            </div>
        </div>

    </div>) : ("No Post Found")}</>
}