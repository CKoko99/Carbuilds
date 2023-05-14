
import {  useState } from "react";



import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
import CreatePostModal from "../Post/CreatePostModal";



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

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const authSelector = useSelector(state => state.auth)
    const authDispatch = useDispatch(authActions)

    function signoutHandler() {

        authDispatch(authActions.logout())
    }

   

    function goHomeHandler() {
        history.push('/')
    }
    function toggleDrawerHandler(setAs) {
        setIsDrawerOpen(setAs)
    }
  
   
    const [createPost, setCreatePost] = useState(false)

    function openCreatePostModal() {
        setCreatePost(true)
    }
    function closeCreatePostModal() {
        setCreatePost(false)
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
                            <Typography onClick={openCreatePostModal}>Create A Post</Typography>

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
                            <Typography onClick={()=>{openCreatePostModal()}}>Create A Post</Typography>
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
            {createPost && <CreatePostModal
                close={closeCreatePostModal}
            />}
        </>
    );
}

export default Navbar;
