import { Box, Modal, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";
import { useState, useRef, useEffect } from "react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';





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
    function closeModalHandler() {
        props.close()
    }
    const cropperRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState(null)
    const [showFileUpload, setShowFileUpload] = useState(true)
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
        console.log(cropperRef)
        const newImageUrls = [...croppedImageUrls]
        if (typeof cropperRef.current?.cropper !== "undefined") {
            newImageUrls.push(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
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

    useEffect(() => {
        if (imageNumber !== null) {
            if (imageNumber >= selectedFiles.length) {
                setShowImageCropper(false)
                setShowImageOrder(true)
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
    }, [imageNumber])
    return <>
        <Modal
            open={true}
            onClose={closeModalHandler}
            className={classes.modal}
        >
            <Box className={classes.paper} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h2" align="center">
                    Create Post
                </Typography>
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
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="images" direction="horizontal">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex' }}>
                                    {croppedImageUrls.map((file, index) => (
                                        <Draggable key={file} draggableId={file} index={index}>
                                            {(provided) => (
                                                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <img style={{ width: "100px" }} src={file} key={file} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </Box>
        </Modal >

    </>
}