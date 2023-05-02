import { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authActions } from "../../../../store/store";
import { useLocation } from 'react-router-dom';

import { Button, Modal } from "@material-ui/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from '@mui/icons-material/Clear';
const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        minWidth: "300px",
    },
}));


export default function AuthErrorModal(props) {
    const classes = useStyles();
    let location = useLocation();
    const authDispatch = useDispatch(authActions)
    const history = useHistory()
    function redirectToLogin() {
        history.push('/login')
        authDispatch(authActions.logout())
    }
    const [modalOpen, setModalOpen] = useState(true)
    //if currently on login page show model1 if not show modal2
    //check if current page is login page
    let modal = null
    if (location.pathname === '/login') {
        modal = <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={classes.modal}
        >
            <Box className={classes.paper}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Login Error
                    </Typography>
                    <ClearIcon onClick={() => setModalOpen(false)} style={{ cursor: 'pointer' }} />

                </Box>
                <Typography m={1} id="modal-modal-description" sx={{ mt: 2 }}>
                    {"Invalid Username or Password"}
                </Typography>
                <Box m={1} sx={{ display: "flex", justifyContent: "center" }}>

                    <Button onClick={() => setModalOpen(false)} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Retry Login
                    </Button>
                </Box>
            </Box>
        </Modal>
    } else {
        modal = <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={classes.modal}

        >
            <Box className={classes.paper}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Not Logged In
                </Typography>
                <ClearIcon onClick={() => setModalOpen(false)} style={{ cursor: 'pointer' }} />
                </Box>
                <Typography m={1} id="modal-modal-description" sx={{ mt: 2 }}>
                    {"Please Login to Continue"}
                </Typography>
                <Box m={1} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={redirectToLogin} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Login
                    </Button>
                </Box>
            </Box>
        </Modal>

    }

    return ReactDOM.createPortal(modal, document.getElementById('modal-root'))
}
