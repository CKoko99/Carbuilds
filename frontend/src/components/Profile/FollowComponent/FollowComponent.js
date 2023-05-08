import { useEffect, useState } from "react"
import { useHttpClient } from "../../../hooks/http-hook"
import Button from '@mui/material/Button';
import { useSelector } from "react-redux"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function FollowComponent(props) {
    const { isLoading, httpError, sendRequest } = useHttpClient()
    const [isFollowing, setIsFollowing] = useState(false)
    const authSelector = useSelector(state => state.auth)

    useEffect(() => {
        if (props.followers.includes(authSelector.userId)) {
            setIsFollowing(true)
        }
    }, [])
    async function followUserHandler(method) {
        try {
            console.log(props.userId)
            console.log(authSelector.userId)
            const responseData = await sendRequest(`http://localhost:5001/api/v1/carbuilds/user/${props.userId}/follow/`, method, JSON.stringify({
                userId: authSelector.userId
            }), {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + authSelector.token
            })

            console.log(responseData)
            if (!responseData.error) {
                if (method === 'POST') {
                    setIsFollowing(true)
                    const updatedFollowers = [...props.followers, authSelector.userId]
                    props.followsUpdated(updatedFollowers)
                }
                else {
                    setIsFollowing(false)
                    const updatedFollowers = props.followers.filter((follower) => follower !== authSelector.userId)
                    props.followsUpdated(updatedFollowers)
                    handleClose();
                    setIsFollowing(false);
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleFollowingClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleUnfollowClick = () => {

        followUserHandler("DELETE");

    };
    return <>
        {httpError}
        {!isFollowing && <Button variant="contained" disabled={isLoading} onClick={() => followUserHandler("POST")} >Follow</Button>}
        {isFollowing && <Box> <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleFollowingClick}
            variant="contained" disabled={isLoading} >Following <KeyboardArrowDownIcon /></Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                    style: {
                        padding: ".25rem 1rem"
                    }
                }}
            >
                <MenuItem
                    sx={{ padding: "1em" }}

                    onClick={handleUnfollowClick}>Unfollow User</MenuItem>
            </Menu></Box>}
    </>

}