import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHttpClient } from "../../../hooks/http-hook";
import Modal from "./Modal";
import classes from './Modal.module.css'


export default function EditProfile(props) {
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const authSelector = useSelector(state => state.auth)
    const aboutRef = useRef()
    const [twitterLink, setTwitterLink] = useState(<></>)
    const twitterRef = useRef()
    function twitterChangeHandler(event){
        if(twitterRef.current.value.trim().includes(' ')){
            setTwitterLink(<div className={classes['link-error']}>Please Enter a Valid Username</div>)
        }else if(twitterRef.current.value.length > 0){
            setTwitterLink(<div className={classes['social-link']}>twitter.com/{twitterRef.current.value}</div>)
        }else{
            setTwitterLink(<></>)
        }
    }
    function refreshPage() {
        window.location.reload(false);
      }
    const [instagramLink, setInstagramLink] = useState(<></>)
    const instagramRef = useRef()
    function instagramChangeHandler(event){
        if(instagramRef.current.value.trim().includes(' ')){
            setInstagramLink(<div className={classes['link-error']}>Please Enter a Valid Username</div>)
        }else if(instagramRef.current.value.length > 0){
            setInstagramLink(<div className={classes['social-link']}>instagram.com/{instagramRef.current.value}</div>)
        }else{
            setInstagramLink(<></>)
        }
    }
    const [youtubeLink, setYoutubeLink] = useState(<></>)
    const youtubeRef = useRef()
    function youtubeChangeHandler(event){
        if(youtubeRef.current.value.trim().includes(' ')){
            setYoutubeLink(<div className={classes['link-error']}>Please Enter a Valid Username</div>)
        }else if(youtubeRef.current.value.length > 0){
            setYoutubeLink(<div className={classes['social-link']}>{youtubeRef.current.value}</div>)
        }else{
            setYoutubeLink(<></>)
        }
    }
    useEffect(()=>{
        aboutRef.current.value = props.user.about
        instagramRef.current.value = props.user.instagram
        twitterRef.current.value = props.user.twitter
        youtubeRef.current.value = props.user.youtube
        instagramChangeHandler()
        youtubeChangeHandler()
        twitterChangeHandler()
    },[])
    async function submitProfileHandler(){
        try {
            const response = await sendRequest('http://localhost:5000/api/v1/carbuilds/user/update/'+ authSelector.userId, 'PATCH',JSON.stringify({
                about: aboutRef.current.value,
                twitter: twitterRef.current.value,
                instagram: instagramRef.current.value,
                youtube: youtubeRef.current.value,
            }), {
                'Content-Type': 'application/json',
                Authorization: "Bearer "+ authSelector.token
            })
            refreshPage()
        } catch (err) {
            console.log("error")
            console.log(err)
        }
    }
    return <Modal title={"Edit Profile"} close={props.close}>
        <form>
            {httpError}
            <div className={classes['setup-section-title']}>About Me</div>
            <textarea ref={aboutRef}></textarea>
            <div className={classes['setup-section']}>
                <div className={classes['setup-section-title']}>Link Twitter</div>
                <input onChange={twitterChangeHandler} ref={twitterRef} placeholder="Enter Username"></input>
                {twitterLink}
                <div className={classes['setup-section-title']}>Link Instagram</div>
                <input onChange={instagramChangeHandler} ref={instagramRef} placeholder="Enter Username"></input>
                {instagramLink}
                <div className={classes['setup-section-title']}>Link Youtube</div>
                <input onChange={youtubeChangeHandler} ref={youtubeRef} placeholder="Enter Your Channel Link"></input>
                {youtubeLink}
                <div className={classes['buttons']}>
                    <button type="button" onClick={props.close}>Cancel</button>
                    <button type="button" onClick={submitProfileHandler}>Submit</button>
                </div>
            </div>
        </form>
    </Modal>
}
