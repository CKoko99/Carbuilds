import { useRef, useState } from "react";
import classes from "./Posts.module.css";

import Vehicle from "../Ui/vehicle/vehicle";

import heart from '../../icons/Ui/filledheart.png'
import emptyheart from '../../icons/Ui/unfilledheart.png'


import { useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
function Profilecard(props) {
    const [currentSlide, setCurrentSlide] = useState(1);
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const commentRef = useRef()
    const authSelector = useSelector(state => state.auth)
    async function likePostHandler() {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/post/like/' + props.postid, 'POST', JSON.stringify({
                userId: authSelector.userId
            }), {
                'Content-Type': 'application/json',
                Authorization: "Bearer "+ authSelector.token
            })
            console.log(responseData)
            props.reload()
        } catch (e) {
            console.log(e)
        }
    }
    let isLiked
    let heartimg
    let userliked = props.likes.find(user => user === authSelector.userId)
    if (userliked) {
        isLiked = true
        heartimg = <img style={{ paddingRight: ".5em" }} alt="heart" src={heart} onClick={likePostHandler} />
    } else {
        isLiked = false
        heartimg = <img alt="heart" style={{ paddingRight: ".5em" }} src={emptyheart} onClick={likePostHandler} />
    }
    let counter = 0
    let slides
    let comments
    if(props.comments){
        comments = props.comments.comments.map(comment => {
            return <div key={comment.id} className={classes['comment']}><a href={"/profile/"+comment.userId}><span style={{ fontWeight: "bold" }}> {comment.username}-</span></a> {comment.text}</div>
        })
    }
    if (props.imgs.length > 1) {
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
    async function submitCommentHandler(){
        if(commentRef.current.value.length > 0){
            console.log("eh1")
            try {
                console.log("eh2")
                const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/comment/' + props.postid, 'POST', JSON.stringify({
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
    return (
        <div className={classes['postcard']}>
            <div className={classes['top-section']}>
                <div className={classes['title']}><a href={"/post/"+props.postid}>
                    {props.title}
                    </a>
                    </div>
            </div>
            <div className={classes['slideshow-container']}>{slides}

                {props.imgs.length > 1 && (<><div
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
                <div className={classes['likes']}>{heartimg}{(props.likes.length > 1) ? (props.likes.length + " likes") : (props.likes.length > 0) ? (props.likes.length + " like") : "Be The First To Like"}</div>
                {props.vehicle && (<div className={classes['vehicle']}><Vehicle year={props.vehicle.year} model={props.vehicle.model} make={props.vehicle.make} /></div>)}
            </div>
            <div className={classes['text-sections']}>
                <div className={classes['description']}><span style={{ fontWeight: "bold" }}> {props.username}-</span> {props.description}</div>
                {comments}
                <div className={classes['comment']}>
                    <input className={classes['comment-input']} ref={commentRef} placeholder="Leave A Comment..." />
                    <button onClick={submitCommentHandler}>post comment</button>
                </div>
            </div>

        </div>
    )
}

export default Profilecard