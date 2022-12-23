import classes from "./Profile.module.css";
import VehicleSelect from "../Ui/vehicle/VehicleSelect/VehicleSelect";
import Vehicle from "../Ui/vehicle/vehicle";
import { useHttpClient } from "../../hooks/http-hook";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ImageUpload from "../shared/Imageupload/ImageUpload";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, LinearProgress } from '@material-ui/core';
import Modal from '@mui/material/Modal';
const theme = createTheme();


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function SetupAccount() {

    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const [usersVehicles, setUsersVehicles] = useState([])
    const authSelector = useSelector(state => state.auth)
    const aboutRef = useRef()


    function validateFormHandler() { }
    async function getUserData() {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/user/' + authSelector.userId, 'GET', null, {
                'Content-Type': 'application/json'
            })

            console.log("User Data")
            console.log(responseData)
            aboutRef.current.value = responseData.about || ""
            instagramRef.current.value = responseData.instagram || ""
            twitterRef.current.value = responseData.twitter || ""
            youtubeRef.current.value = responseData.youtube || ""

            twitterChangeHandler()

        } catch (err) {
        }
    }
    useEffect(() => {
        getUserData()
    }, [authSelector.userId])

    async function getVehiclesHandler() {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/vehicles/' + authSelector.userId, 'GET', null, {
                'Content-Type': 'application/json'
            })

            console.log("vehicles")
            console.log(responseData)
            setUsersVehicles(responseData.vehiclesList)
            console.log("here we are")
            console.log(responseData.vehiclesList)
        } catch (err) {
        }
    }
    useEffect(() => {
        if (authSelector.userId) {
            getVehiclesHandler()
        }
    }, [authSelector.userId])

    const Vehicles = usersVehicles.map(car => {
        return <div style={{ paddingRight: '.5em' }}><Vehicle key={car.id} year={car.year} make={car.make} model={car.model} /></div>
    })
    async function submitVehicleHandler(vehicleobject) {
        console.log(vehicleobject)
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/vehicles', 'POST', JSON.stringify({
                userId: authSelector.userId,
                model: vehicleobject.model,
                year: vehicleobject.year,
                make: vehicleobject.make
            }), {
                'Content-Type': 'application/json'
            })

            console.log(responseData)

        } catch (err) {
        }
        getVehiclesHandler()
        handleCloseVehicleModal()
    }

    const [twitterLink, setTwitterLink] = useState(<></>)
    const twitterRef = useRef()
    function twitterChangeHandler(event) {
        if (twitterRef.current.value.trim().includes(' ')) {
            setTwitterLink(<div className={classes['link-error']}>Please Enter a Valid Username</div>)
        } else if (twitterRef.current.value.length > 0) {
            setTwitterLink(<div className={classes['social-link']}>twitter.com/{twitterRef.current.value}</div>)
        } else {
            setTwitterLink(<></>)
        }
    }
    const [instagramLink, setInstagramLink] = useState(<></>)
    const instagramRef = useRef()
    function instagramChangeHandler(event) {
        if (instagramRef.current.value.trim().includes(' ')) {
            setInstagramLink(<div className={classes['link-error']}>Please Enter a Valid Username</div>)
        } else if (instagramRef.current.value.length > 0) {
            setInstagramLink(<div className={classes['social-link']}>instagram.com/{instagramRef.current.value}</div>)
        } else {
            setInstagramLink(<></>)
        }
    }
    const [youtubeLink, setYoutubeLink] = useState(<></>)
    const youtubeRef = useRef()
    function youtubeChangeHandler(event) {
        if (youtubeRef.current.value.trim().includes(' ')) {
            setYoutubeLink(<div className={classes['link-error']}>Please Enter a Valid Username</div>)
        } else if (youtubeRef.current.value.length > 0) {
            setYoutubeLink(<div className={classes['social-link']}>{youtubeRef.current.value}</div>)
        } else {
            setYoutubeLink(<></>)
        }
    }
    async function submitProfileHandler() {
        try {
            const response = await sendRequest('http://localhost:5000/api/v1/carbuilds/user/update/' + authSelector.userId, 'PATCH', JSON.stringify({
                about: aboutRef.current.value,
                twitter: twitterRef.current.value,
                instagram: instagramRef.current.value,
                youtube: youtubeRef.current.value,

            }), {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + authSelector.token
            })
        } catch (err) {
        }
    }
    function logdata(one, two, three) {
        console.log(one)
        console.log(two)
        console.log(three)
    }
    async function submitImageUpload(id, image, validity) {
        console.log(image)
        if (validity) {

            try {
                const imageData = new FormData()
                imageData.append('image', image)

                const response = await sendRequest('http://localhost:5000/api/v1/carbuilds/users/avatar/' + authSelector.userId, 'POST', imageData)
            }catch (err) {
            }
        }
    }
    //Vehicle Modal
    const [openVehicleModal, setOpenVehicleModal] = useState(false);
    const handleOpenVehicleModal = () => setOpenVehicleModal(true);
    const handleCloseVehicleModal = () => setOpenVehicleModal(false);
    return (<>
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant='h3'>
                        Account Details
                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    {httpError && (<div>{httpError}</div>)}
                    <Box component="form" noValidate onSubmit={validateFormHandler} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h5'>Avatar </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <button> Upload Image</button>
                            </Grid>
                            <Grid item xs={12}>

                                <Typography variant='h5'>About Me </Typography>
                            </Grid>

                            <Grid item xs={12}>

                                <TextField inputRef={aboutRef} id="outlined-multiline-static" label="About Me" multiline rows={4} defaultValue="Default Value" variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h5'>Add Personal Vehicles </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {Vehicles}
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleOpenVehicleModal}
                                >
                                    Add New Vehicle
                                </Button>
                                <Modal
                                    open={openVehicleModal}
                                    onClose={handleCloseVehicleModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"

                                >
                                    <Box sx={style} >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Enter New Vehicle Information
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <VehicleSelect submitVehicle={submitVehicleHandler} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Modal>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h5'>Social Media Links </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField inputRef={twitterRef} InputLabelProps={{ shrink: true }} onChange={twitterChangeHandler} id="outlined-basic" label="Twitter" variant="outlined" />

                            </Grid>
                            <Grid item xs={12}>
                                {twitterLink}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField inputRef={instagramRef} InputLabelProps={{ shrink: true }} onChange={instagramChangeHandler} id="outlined-basic" label="Instagram" variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                {instagramLink}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField inputRef={youtubeRef} InputLabelProps={{ shrink: true }} onChange={youtubeChangeHandler} id="outlined-basic" label="Youtube" variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                {youtubeLink}
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='contained' color='primary' type='submit' onClick={submitProfileHandler}>Submit</Button>
                            </Grid>

                            <Grid item xs={12}>
                                {isLoading && <LinearProgress />}
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>

        <ImageUpload onInput={submitImageUpload} />

    </>)
}

