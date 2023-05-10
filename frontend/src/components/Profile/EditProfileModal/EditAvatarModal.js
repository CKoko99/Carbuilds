import { Box, Button, Modal, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './circle.css'
import { useHttpClient } from "../../../hooks/http-hook";
import { useSelector } from "react-redux";
import imageCompression from 'browser-image-compression';


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

export default function EditAvatarModal(props) {
    const classes = useStyles();
    function closeModalHandler() {
        props.close()
    }
    const { sendRequest } = useHttpClient()
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [croppedImageUrl, setCroppedImageUrl] = useState('');
    const cropperRef = useRef(null);

    const authSelector = useSelector(state => state.auth)
    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    }

    function handleCrop() {
        console.log(cropperRef)
        if (typeof cropperRef.current?.cropper !== "undefined") {
            setCroppedImageUrl(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }

    }

    async function submitImageUpload() {
        if (!croppedImageUrl) {
            console.log("No image to upload")
            return;
        }

        try {
            const options = {
                maxSizeMB: 0.009,
                useWebWorker: true
            };
            // Compress the image blob
            const compressedBlob = await imageCompression(dataURItoBlob(croppedImageUrl), options);

            // Convert the compressed blob to a file object
            const compressedFile = new File([compressedBlob], "avatar.jpg", { type: compressedBlob.type });

            console.log(compressedFile);
            console.log(compressedFile.size);

            const formData = new FormData();
            formData.append("image", compressedFile);
            console.log(formData);
            const responseData = await sendRequest(
                "http://localhost:5001/api/v1/carbuilds/users/avatar/" + authSelector.userId,
                "POST",
                formData, {
                Authorization: "Bearer " + authSelector.token
            });
            console.log("Image uploaded successfully: ", responseData);
        } catch (err) {
            console.error("Error uploading image: ", err);
        }
    }

    // Helper function to convert a data URL to a Blob object
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }


    return <>
        <Modal open={true}
            onClose={closeModalHandler}
            className={classes.modal}
            style={{ xs: { width: "90%" }, sm: { width: "50%" } }}
        >
            <Box className={classes.paper} sx={{ width: { xs: "90%", sm: "50%" }, display: "flex", flexDirection: "column" }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Change Profile Photo
                </Typography>
                <Typography m={1} id="modal-modal-description" sx={{ mt: 2 }}>
                    Upload Photo
                </Typography>
                <Box m={1} sx={{ display: "flex", justifyContent: "center" }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </Box>
                <Box sx={{ width: "100%" }}>

                    {imageUrl && (
                        <Cropper
                            ref={cropperRef}
                            src={imageUrl}
                            aspectRatio={1}
                            viewMode={1}
                            guides={false}
                            zoomable={false}
                            crop="circle"
                        />
                    )}
                </Box>
                <button onClick={handleCrop}>Crop Image</button>
                <Box sx={{ width: "100%" }}>
                    {croppedImageUrl && <img src={croppedImageUrl} style={{ width: "100%", borderRadius: "100%", display: "block" }} alt="Cropped" />}
                </Box>
                {file && (
                    <div>
                        <button onClick={submitImageUpload}>Upload Image</button>
                    </div>
                )}
                <Typography m={1} id="modal-modal-description" sx={{ mt: 2 }}>
                    Remove Current Photo
                </Typography>

                <Button onClick={closeModalHandler} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Cancel
                </Button>
            </Box>
        </Modal >
    </>
}