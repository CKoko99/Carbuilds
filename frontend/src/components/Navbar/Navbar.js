
import { useEffect, useState } from "react";

import classes from "./Navbar.module.css";
import CBlogo from "./CBlogo.png";
import ham from './hamic.png'
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import { authActions } from "../../store/store";
function Navbar() {
    const history = useHistory()
    const [modalOpen, setModalOpen] = useState(false);
    const authSelector = useSelector(state => state.auth)
    const authDispatch = useDispatch(authActions)
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const [showAuth, setShowAuth] = useState(<div onClick={closeModalHandler} className={classes["modal-option"]}>
        <a href="/signup">Sign-up</a>
    </div>)
    function signoutHandler() {
        setModalOpen(false);
        authDispatch(authActions.logout())
    }
    async function getUserData() {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/user/' + authSelector.userId, "GET", null, {
                'Content-Type': 'application/json'
            })
        } catch (err) {
        }
    }
    useEffect(() => {
        if (authSelector.isLoggedIn) {
            getUserData()

            setShowAuth(<div onClick={signoutHandler} className={classes["modal-option"]}>
                <a href="/">Logout</a>
            </div>)
        }
    }, [authSelector.isLoggedIn])
    function closeModalHandler() {
        setModalOpen(false);
    }
    function openModalHandler() {
        setModalOpen(true);
    }
    function goHomeHandler() {
        history.push('/')
    }
    let modal = <></>;
    if (modalOpen) {
        modal = (
            <>
                {" "}
                <div className={classes["modal"]}>
                    <div className={classes["modal-exit"]} onClick={closeModalHandler}>
                        X
                    </div>
                    <div className={classes["modal-options"]}>
                        <div onClick={closeModalHandler} className={classes["modal-option"]}>
                            <a href="/">Home</a>
                        </div>
                        <div onClick={closeModalHandler} className={classes["modal-option"]}>
                            <a href="/topposts">Top Posts</a>
                        </div>
                        {authSelector.isLoggedIn &&(

                        <div onClick={closeModalHandler} className={classes["modal-option"]}>
                            <a href={"/profile/"+authSelector.userId}>My Profile</a>
                        </div>
                        )}
                        <div onClick={closeModalHandler} className={classes["modal-option"]}>
                            <a href="/vendors">Vendors</a>
                        </div>
                        {showAuth}
                    </div>
                </div>
            </>
        );
    } else {
        modal = <></>;
    }
    return (
        <>
            <div className={classes.Navbar}>
                <div className={classes.desktop}>
                    <div className={classes["section"]}>
                        <div className={classes["bottom-item"]}>
                            <a href='/'>
                                <img alt="logo" src={CBlogo} />
                            </a>
                        </div>
                        <a href="/plan/city">
                            <div className={classes["bottom-item"]}>Plan A Trip!</div>
                        </a>

                        <a href="/cities">
                            <div className={classes["bottom-item"]}>Cities</div>
                        </a>
                        <a href="/flights">
                            <div className={classes["bottom-item"]}>Airlines</div>
                        </a>
                    </div>
                </div>
                <div className={classes["mobile"]}>
                    <div className={classes["mobile-sections"]}>
                        <div className={classes["icons"]}>
                            <div className={classes['icon']}>
                                <img
                                    onClick={goHomeHandler}
                                    alt="logo" src={CBlogo}
                                />
                            </div>
                            <div className={classes['icon']}>
                                <img alt="ham" src={ham} onClick={openModalHandler} />
                            </div>
                        </div>
                    </div>
                </div>
                {modal}
            </div>
        </>
    );
}

export default Navbar;
