import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../../../hooks/http-hook";
import { authActions } from "../../../../store/store";
import Modal from "../Modal";
import classes from '../Modal.module.css'


export default function AuthErrorModal(props) {
    const authDispatch = useDispatch(authActions)
    const history = useHistory()
    function redirectToLogin(){
        history.push('/login')
        authDispatch(authActions.logout())
    }
    return <Modal title={"Authencation Error"} close={redirectToLogin}>
        <>Please Login to Continue</>
        <div className={classes['buttons']}>
        <a className={`${classes['button']} ${classes['continue']}`} onClick={redirectToLogin} target="_blank" href={"/login"}>Login</a>
        </div>
    </Modal>
}
