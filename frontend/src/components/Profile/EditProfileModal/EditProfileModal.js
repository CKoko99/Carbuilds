import { Box, Button, Modal, TextField, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@mui/material";

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


    return <Modal open={true}
        onClose={closeModalHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={classes.modal}>
        <Box sx={{ bgcolor: "white", padding: "2rem" }}>
            <Typography variant="h5" style={{marginBottom: "1rem"}}>Edit Profile</Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={4} >
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Avatar sx={{ width: "3rem", height: "3rem"}} alt="Remy Sharp" src={caravi} />
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{props.profileData.username}</Typography>
                    <Typography color="primary">Change Profile Photo</Typography>
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
                        <TextField id="Bio"  label="" variant="outlined" />
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
                        <TextField id="Twitter"  label="" variant="outlined" />
                    </Box>
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
                        <TextField id="Instagram"  label="" variant="outlined" />
                    </Box>
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
                        <TextField id="Youtube"  label="" variant="outlined" />
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{display: "flex", justifyContent: "Space-around", mt: "2rem"}}>

            <Button variant="contained" color="error" > Cancel</Button>
            <Button variant="contained" color="primary"> Apply</Button>
            </Box>
        </Box>
    </Modal>
}