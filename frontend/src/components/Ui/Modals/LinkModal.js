import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHttpClient } from "../../../hooks/http-hook";
import Modal from "./Modal";
import classes from './Modal.module.css'


export default function LinkModal(props) {
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    
    return <Modal title={"You Are Leaving Carbuilds"} close={props.close}>
        <>Continue to <span style={{ fontWeight: "bold" }}>{props.link}?</span></>
        <div className={classes['buttons']}>
        <a className={`${classes['button']} ${classes['cancel']}`} onClick={props.close}>Cancel</a>
        <a className={`${classes['button']} ${classes['continue']}`} onClick={props.close} target="_blank" href={props.link}>Continue</a>
        </div>
    </Modal>
}
