import { Box, Modal, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";
import { useState, useRef, useEffect, useCallback } from "react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import imageCompression from 'browser-image-compression';
import { useHttpClient } from "../../hooks/http-hook";
import { useSelector } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import NewVehicleModal from "../Ui/Modals/NewVehicleModal";




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

export default function CreatePostModal(props) {

    const classes = useStyles();
    const authSelector = useSelector(state => state.auth)
    const { sendRequest } = useHttpClient()
    function closeModalHandler() {
        props.close()
    }
    const cropperRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState(null)
    const [showFileUpload, setShowFileUpload] = useState(true)
    const [postTitle, setPostTitle] = useState("")
    const [userInfo, setUserInfo] = useState(null)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    useEffect(() => {
        //get user info for vehicles
        console.log(`${process.env.REACT_APP_BACKEND_URL}/user/${authSelector.userId}`)
        async function getUserInfo() {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/user/${authSelector.userId}`)
            console.log(responseData)
            setUserInfo(responseData.user)
        }
        getUserInfo()
        getVehiclesHandler()
    }, [])
    function handleFileChange(event) {
        //read the images and set the state so I can show on the screen use file reader
        const selectedFiles = event.target.files;
        const images = []
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                images.push(URL.createObjectURL(selectedFiles[i]))
            }
        }
        console.log("images")
        console.log(images)
        setSelectedFiles(images)
        setShowImageCropper(true)
        setShowFileUpload(false)
        setImageNumber(0)
        const updatedCropper = <Cropper
            ref={cropperRef}
            src={images[0]}
            aspectRatio={aspectRatio}
            viewMode={1}
            guides={false}
            zoomable={false}
        />
        setCropperComponent(
            updatedCropper
        )
        setShowImagePreviousButton(true)
    }

    const [showImageCropper, setShowImageCropper] = useState(false)
    const [imageNumber, setImageNumber] = useState(null)
    const [aspectRatio, setAspectRatio] = useState(1)
    const [cropperComponent, setCropperComponent] = useState(null);
    const [croppedImageUrls, setCroppedImageUrls] = useState([]);

    function handleAspectRatioChange(num1, num2) {
        const newAspectRatio = num1 / num2;
        setAspectRatio(newAspectRatio);
        console.log(newAspectRatio);

        // Update the Cropper component with the new aspect ratio
        console.log(cropperRef.current.cropper.options.aspectRatio)
        cropperRef.current.cropper.setAspectRatio(newAspectRatio);
    }
    function handleCrop() {
        const newImageUrls = [...croppedImageUrls]
        if (typeof cropperRef.current?.cropper !== "undefined") {
            if (newImageUrls[imageNumber] === undefined) {
                newImageUrls.push(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
            } else {
                newImageUrls[imageNumber] = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            }
        }
        setCroppedImageUrls(newImageUrls);
        setImageNumber(imageNumber + 1)
    }

    const [showImageOrder, setShowImageOrder] = useState(false)
    function handleOnDragEnd(result) {
        if (!result.destination) {
            return;
        }

        const items = Array.from(croppedImageUrls);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setCroppedImageUrls(items);
    }
    const [showImagePreviousButton, setShowImagePreviousButton] = useState(false)
    function goBackOneImage() {
        if (imageNumber !== 0) {
            console.log("Image Number After Clicking Back Button")
            console.log(imageNumber - 1)

            setImageNumber(imageNumber - 1)
        }
    }
    function leaveImageOrder() {
        setShowImageOrder(false)
        setShowImageCropper(true)
        setImageNumber(selectedFiles.length - 1)
        setShowImagePreviousButton(true)
        console.log(selectedFiles.length - 1)
    }


    useEffect(() => {
        if (imageNumber !== null) {
            if (imageNumber >= selectedFiles.length) {
                setShowImageCropper(false)
                setShowImageOrder(true)
                setShowImagePreviousButton(false)
            } else {
                const updatedCropper = <Cropper
                    ref={cropperRef}
                    src={selectedFiles[imageNumber]}
                    aspectRatio={aspectRatio}
                    viewMode={1}
                    guides={false}
                    zoomable={false}
                />
                setCropperComponent(updatedCropper)
            }
        }
    }, [imageNumber, aspectRatio, selectedFiles])


    async function handlePostSubmit() {
        console.log("start")
        const options = {
            maxSizeMB: 0.009,
            useWebWorker: true
        };
        try {

            const formData = new FormData();
            for (let i = 0; i < selectedFiles.length; i++) {
                const name = `image ${i}`
                const compressedBlob = await imageCompression(dataURItoBlob(croppedImageUrls[i]), options);
                const compressedFile = new File([compressedBlob], `${name}.jpg`, { type: compressedBlob.type });
                formData.append("images", compressedFile)
            }
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            console.log("start request")
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/posts/${authSelector.userId}`,
                "POST",
                formData, {
                Authorization: "Bearer " + authSelector.token
            });
            console.log("end request")
            // if response is good then close the modal
            if (responseData.ok) {
                props.close()
            }
        } catch (error) {
            console.log(error)
        }
    }
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
    const [usersVehicles, setUsersVehicles] = useState([]);
    const getVehiclesHandler = useCallback(async () => {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/vehicles/${authSelector.userId}`, 'GET', null, {
                'Content-Type': 'application/json'
            });
            console.log(responseData)
            if (!responseData.error) {
                setUsersVehicles(responseData.vehiclesList);
            }
        } catch (err) {
            // handle error
        }
    }, [sendRequest, authSelector.userId, setUsersVehicles]);

    const [openNewVehcielModal, setOpenNewVehcielModal] = useState(false)

    function openNewVehcielModalHandler() {
        setOpenNewVehcielModal(true)
    }
    function closeNewVehicleModalHandler() {
        setOpenNewVehcielModal(false)
    }
    function reloadVehicles() {
        getVehiclesHandler();
        closeNewVehicleModalHandler();
    }
    function setSelectedVehicleHandler(vehicle){
        setSelectedVehicle(vehicle)
    }
    return <>
        <Modal
            disableEnforceFocus
            open={true}
            onClose={closeModalHandler}
            className={classes.modal}
        >
            <Box className={classes.paper} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h2" align="center">
                    Create Post
                </Typography>
                {showImageOrder && <button onClick={leaveImageOrder}>Leave Image Order</button>}
                {showImagePreviousButton && <button onClick={goBackOneImage}>Go Back One Image</button>}
                <Box>
                    {showFileUpload &&
                        <input type="file" accept="image/*" onChange={handleFileChange} multiple />}
                    {/*selectedFiles && Object.entries(selectedFiles).map((file, index) => {
                        console.log(file)
                        return <img style={{ width: "100px" }} src={file[1]} key={index} />
                    })*/}
                </Box>
                <Box>
                    {imageNumber === 0 && <>
                        < button onClick={() => { handleAspectRatioChange(1, 1) }}>1:1</button>
                        < button onClick={() => { handleAspectRatioChange(16, 9) }}>16:9</button>
                        < button onClick={() => { handleAspectRatioChange(4, 5) }}>4:5</button>
                        < button onClick={() => { setCropperComponent(<></>) }}>delete</button>
                    </>}

                    {
                        showImageCropper && <> {cropperComponent}

                            <button onClick={handleCrop}>Crop</button>
                        </>
                    }
                    {/*<Box>
                        {croppedImageUrls && croppedImageUrls.map((url, index) => {

                            return <img style={{ width: "100px" }} src={url} key={index} />
                        })}
                    </Box>*/}
                </Box>
                {showImageOrder && (
                    <>  <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="images" direction="horizontal">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', overflow: "auto" }}>
                                    {croppedImageUrls.map((file, index) => (
                                        <Draggable key={file} draggableId={file} index={index}>
                                            {(provided) => (
                                                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <img alt="alt" style={{ width: "200px", padding: "12px" }} src={file} key={file} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                        <Box>
                            {/*Create a form to add post title  */}
                            <TextField id="PostTitle"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                label="Enter Post Title"
                                variant="outlined"
                            />
                            <Box>
                                {/*Create a form to add vehicle to Post  */}
                                {usersVehicles.map((vehicle, index) => {
                                   return <Button color={(selectedVehicle && vehicle._id === selectedVehicle._id) ? "primary" : "secondary"} key={index} onClick={() => { setSelectedVehicleHandler(vehicle) }}>{vehicle.year} {vehicle.make} {vehicle.model}</Button>
                                }
                                )
                                }
                                {selectedVehicle && <Button color="secondary" onClick={()=>{setSelectedVehicleHandler(null)}}>Cancel</Button>}
                                <Button onClick={openNewVehcielModalHandler}> Add Vehicle</Button>
                            </Box>
                        </Box>

                        <button onClick={handlePostSubmit}>Submit Post</button>
                    </>
                )}
            </Box>
        </Modal >
        {openNewVehcielModal && <NewVehicleModal
            close={closeNewVehicleModalHandler}
            open={openNewVehcielModal}
            closeAndRefresh={reloadVehicles} />}
    </>
}