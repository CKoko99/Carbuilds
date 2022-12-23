import { useEffect, useRef, useState } from "react";
import classes from "./Hero.module.css";

const Images = [
    {
        title: "img 1",
        link: "http://cdn.shopify.com/s/files/1/0067/6236/4997/articles/Featured_-_Top_10___M3_M4_1024x1024.jpg?v=1586191328"
    },
    {
        title: "img 2",
        link: "https://www.carscoops.com/wp-content/uploads/2018/01/c18ea43e-atlantis-blue-bmw-m3-4.jpg"
    }
]
function Hero(props) {
    const [currentSlide, setCurrentSlide] = useState(1);
    const timeoutRef = useRef(null);

    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
    let counter = 0;
    const slides = Images.map((img) => {
        counter++;
        if (counter === currentSlide) {
            return (
                <div
                    key={img.title}
                    className={`${classes["mySlides"]} ${classes["chosen"]} ${classes["fade"]}`}
                >
                    <span className={classes["helper"]}></span>
                    <img
                        src={img.link}
                        alt={img.title}
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
    function changeSlideHandler(n) {
        const newSlide = currentSlide + n;
        if (newSlide < 1) {
            setCurrentSlide(Images.length);
        } else if (newSlide > Images.length) {
            setCurrentSlide(1);
        } else {
            setCurrentSlide(newSlide);
        }
    }
    function autoSlide(index) {
        if (index >= Images.length) {
            setCurrentSlide(1)
        } else {
            setCurrentSlide(index + 1)
        }
    }
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            autoSlide(currentSlide)
        }, 5000)
        return () => {
            resetTimeout();
        };
    },
        [currentSlide])
    return (
        <div className={classes["hero"]}>
            <div className={classes['title']}>Featured Builds</div>
            <div className={classes['slideshow-container']}>
                {slides}
                <div
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
                >
                    &#10095;
                </div>
            </div>
        </div>
    )
}

export default Hero