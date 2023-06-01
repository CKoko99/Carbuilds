import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

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

export default function NewVehicleModal(props) {
    const classes = useStyles();
    function closeModalHandler() {
        props.close()
    }
    function closeAndRefreshModalHandler() {
        props.closeAndRefresh()
    }
    return (
        <Modal
            open={props.open}
            onClose={closeModalHandler}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={classes.modal}
        >
            <Box className={classes.paper}>
                <h2 id="modal-modal-title">Delete Vehicle From Profile?</h2>
                <p id="modal-modal-description">
                    {`Are you sure you want to delete ${props.vehicle.year} ${props.vehicle.make} ${props.vehicle.model} from your profile? ${props.vehicle._id}?`}
                </p>
                <button onClick={closeAndRefreshModalHandler}>Close and Refresh</button>
                <button onClick={closeModalHandler}>Close</button>
            </Box>
        </Modal>
    );
}