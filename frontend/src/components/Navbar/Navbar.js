
import { useEffect, useState } from "react";

import classes from "./Navbar.module.css";
import CBlogo from "./CBlogo.png";
import ham from './hamic.png'
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import { authActions } from "../../store/store";

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from "@material-ui/core";

import Link from '@mui/material/Link';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: '100%',
        maxWidth: '500px'
    },
    textAlign: "left",
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '40%',
            '&:focus': {
                width: '38ch',
            },
        },
    },
}));


function Navbar() {
    const history = useHistory()
    const [modalOpen, setModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    function toggleDrawerHandler(setAs) {
        setIsDrawerOpen(setAs)
    }
    function signoutHandler() {
        setIsDrawerOpen(false);
        authDispatch(authActions.logout())
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
                        {authSelector.isLoggedIn && (

                            <div onClick={closeModalHandler} className={classes["modal-option"]}>
                                <a href={"/profile/" + authSelector.userId}>My Profile</a>
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
        <><Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ display: { xs: 'block', sm: 'none' }, mr: 2 }}
                        onClick={() => toggleDrawerHandler(true)}
                    >
                        <MenuIcon sx={{ display: { xs: 'block', sm: 'none' } }} />
                    </IconButton>
                    <SwipeableDrawer
                        anchor="left"
                        open={isDrawerOpen}
                        onClose={() => toggleDrawerHandler(false)}
                        onOpen={() => toggleDrawerHandler(true)}
                        PaperProps={{

                            sx: {
                                width: "85%"
                            }
                        }}
                    >

                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "15px"
                        }}>
                            <Box sx={{ display: "flex", fontSize: "2em" }}>
                                <Typography onClick={() => toggleDrawerHandler(false)} sx={{ marginRight: "5px", fontSize: "1.8rem" }}>X</Typography>
                                <Typography sx={{ marginRight: "5px", fontSize: "1.8rem" }}>RU</Typography>
                            </Box>
                            {!authSelector.isLoggedIn && <>
                                <Button
                                    variant="contained"
                                    href="/login"
                                    style={{ backgroundColor: '#39304A', color: 'white', margin: "10px 0px" }}
                                >Login</Button>
                                <Button
                                    variant="contained"
                                    href="/signup"
                                    style={{ backgroundColor: '#1282A2', color: 'white' }}
                                >Sign Up</Button></>}
                            {authSelector.isLoggedIn && <>
                                <Link href="/" style={{ textDecoration: "none", color: "black" }}>Home</Link>
                                <Link href="/toposts" style={{ textDecoration: "none", color: "black" }}>Top Posts</Link>
                                <Link href={"/profile/" + authSelector.userId} style={{ textDecoration: "none", color: "black" }}> My Profile</Link>
                                <Button onClick={signoutHandler} href="/" variant="contained" style={{ backgroundColor: '#39304A', color: 'white', margin: "10px 0px" }}>Logout</Button>
                            </>}
                        </Box>

                    </SwipeableDrawer>
                    <div onClick={goHomeHandler}>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            onClick={goHomeHandler}
                        //sx={{ flexGrow: 1}}
                        >
                            RU
                        </Typography>
                    </div>
                    <Search
                        sx={{ display: { xs: 'none', sm: 'block' } }}

                    >
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}

                        />
                    </Search>
                    {!authSelector.isLoggedIn &&
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }} style={{ margin: "auto 0 auto auto" }}>
                            <Button
                                variant="contained"
                                href="/login"
                                style={{ backgroundColor: '#39304A', color: 'white', marginRight: '10px' }}
                            >Login</Button>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#1282A2', color: 'white', marginRight: '10px' }}
                            >Sign Up</Button>
                        </Box>}
                    {authSelector.isLoggedIn &&
                        <Box sx={{ display: { xs: 'none', sm: 'flex' } }} style={{ margin: "auto 0 auto auto" }}>
                            <Link margin={"auto 8px"}
                                color="inherit" href={"/profile/" + authSelector.userId}>My Profile</Link>
                            <Link onClick={signoutHandler}
                                href="/"
                                margin={"auto 8px"}
                                color="inherit">Logout</Link>
                        </Box>}
                </Toolbar>
            </AppBar>
        </Box>
        </>
    );
}

export default Navbar;
