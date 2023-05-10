import { Box, Button, Modal, TextField, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { useHttpClient } from "../../../hooks/http-hook";
import { useSelector } from "react-redux";
import EditAvatarModal from "./EditAvatarModal";

import caravi from '../CBpost.jpeg'
const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }, paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        minWidth: "300px",
    },
}));


export default function EditProfileModal(props) {
    const classes = useStyles();

    function closeModalHandler() {
        props.close()
    }
    const [bio, setBio] = useState(props.profileData.about)
    const [twitter, setTwitter] = useState(props.profileData.twitter)
    const [instagram, setInstagram] = useState(props.profileData.instagram)
    const [youtube, setYoutube] = useState(props.profileData.youtube)
    const { httpError, sendRequest } = useHttpClient();
    const authSelector = useSelector(state => state.auth)
    const handleBioChange = (event) => {
        setBio(event.target.value);
    };
    const handleTwitterChange = (event) => {
        setTwitter(event.target.value);
    };
    const handleInstagramChange = (event) => {
        setInstagram(event.target.value);
    };
    const handleYoutubeChange = (event) => {
        setYoutube(event.target.value);
    };

    async function submitProfileHandler() {
        try {
            const response = await sendRequest('http://localhost:5001/api/v1/carbuilds/user/update/' + authSelector.userId, 'PATCH', JSON.stringify({
                about: bio,
                twitter: twitter,
                instagram: instagram,
                youtube: youtube,

            }), {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + authSelector.token
            })
            if (!response.error) {
                props.submit();
            }
        } catch (err) {
        }
    }

    const [editAvatar, setEditAvatar] = useState(false);
    const openEditAvatarHandler = () => { setEditAvatar(true) };
    const closeEditAvatarHandler = () => { setEditAvatar(false) };

    return <> <Modal open={true}
        onClose={closeModalHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={classes.modal}>
        <Box sx={{ bgcolor: "white", padding: "2rem" }}>
            <Typography variant="h5" style={{ marginBottom: "1rem" }}>Edit Profile</Typography>

            <Grid container spacing={2}>
                <Grid item xs={4} >
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Avatar sx={{ width: "3rem", height: "3rem" }} alt="Remy Sharp" src={caravi} />
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{props.profileData.username}</Typography>
                    <Typography onClick={openEditAvatarHandler} color="primary">Change Profile Photo</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4} >
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography>Bio</Typography>
                    </Box>
                </Grid >
                <Grid item xs={8}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <TextField id="Bio" value={bio} onChange={handleBioChange}
                            fullWidth style={{ width: "100%", padding: "0" }}
                            multiline
                            InputProps={{ style: { padding: ".5rem" } }}
                            inputProps={{
                                style: {
                                    padding: 0,
                                    minHeight: "4rem",
                                    width: "100%",
                                }
                            }} label="" variant="outlined" />
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4} >
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography>Twitter</Typography>
                    </Box>
                </Grid >
                <Grid item xs={8}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <TextField id="Twitter" value={twitter} onChange={handleTwitterChange} label="" variant="outlined" />
                    </Box>
                    {twitter !== "" ? <Typography color="primary">twitter.com/{twitter}</Typography> : null}
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4} >
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography>Instagram</Typography>
                    </Box>
                </Grid >
                <Grid item xs={8}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <TextField id="Instagram" value={instagram} onChange={handleInstagramChange} label="" variant="outlined" />
                    </Box>
                    {instagram !== "" ? <Typography color="primary">instagram.com/{instagram}</Typography> : null}
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4} >
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography>Youtube</Typography>
                    </Box>
                </Grid >
                <Grid item xs={8}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <TextField id="Youtube" value={youtube} onChange={handleYoutubeChange} label="" variant="outlined" />
                    </Box>
                    {youtube !== "" ? <Typography color="primary">youtube.com/{youtube}</Typography> : null}
                </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "Space-around", mt: "2rem" }}>

                <Button variant="contained" color="default" onClick={closeModalHandler} > Cancel</Button>
                <Button variant="contained" color="primary" onClick={submitProfileHandler}> Apply</Button>
            </Box>
        </Box>

    </Modal>
        {httpError && (<div>{httpError}</div>)}
        {editAvatar && <EditAvatarModal
            close={closeEditAvatarHandler}
            open={openEditAvatarHandler}
            profileData={props.profileData} />}
    </>
}