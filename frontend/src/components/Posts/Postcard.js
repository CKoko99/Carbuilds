import { useState } from "react";
import classes from "./Posts.module.css";

import Vehicle from "../Ui/vehicle/vehicle";

import heart from '../../icons/Ui/filledheart.png'
import emptyheart from '../../icons/Ui/unfilledheart.png'


function Postcard(props) {
    const [currentSlide, setCurrentSlide] = useState(1);
    let isLiked = false
    let heartimg = <img alt="heart" style={{ paddingRight: ".5em" }} src={emptyheart} />
    if (props.liked) {
        isLiked = true
    }
    if (isLiked) {
        heartimg = <img style={{ paddingRight: ".5em" }} alt="heart" src={heart} />
    }
    const comments = props.comments.map(comment =>{
        return <div key={comment.id} className={classes['comment']}><span style={{ fontWeight: "bold" }}> {comment.username}-</span> {comment.text}</div>
    })
    let counter = 0
    let slides
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
                    <div key={img.title} className={`${classes["mySlides"]} ${classes["fade"]}`}>
                        <span class="helper"></span>
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
    return (
        <div className={classes['postcard']}>
            <div className={classes['top-section']}>
                <div className={classes['title']}>{props.title}</div>
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
                <div className={classes['likes']}>{heartimg}{props.likes} likes</div>
                <div className={classes['vehicle']}><Vehicle year={props.vehicle.year} model={props.vehicle.model} make={props.vehicle.make} /></div>
            </div>
            <div className={classes['text-sections']}>
                <div className={classes['description']}><span style={{ fontWeight: "bold" }}> {props.username}-</span> {props.description}</div>
                {comments}
                <div className={classes['comment']}>
                    <input className={classes['comment-input']} placeholder="Leave A Comment..." />
                </div>
            </div>

        </div>
    )
}

export default Postcard