import React, { useState, useEffect } from "react";
import { Avatar, Box, CircularProgress, Modal, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../../hooks/http-hook";
import caravi from '../CBpost.jpeg'



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


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function FollowListModal(props) {
    const classes = useStyles();

    const [modalOpen, setModalOpen] = useState(true)
    const [modalTab, setModalTab] = useState(props.modalTab)
    const handleChange = (event, newValue) => {
        console.log(newValue)
        setModalTab(newValue);
    };
    const [isFollowersLoaded, setIsFollowersLoaded] = useState(false)
    const [isFollowingLoaded, setIsFollowingLoaded] = useState(false)
    const [followersList, setFollowersList] = useState([])
    const [followingList, setFollowingList] = useState([])

    const { isLoading, httpError, sendRequest } = useHttpClient()

    async function getListOfUsers(followList) {
        try {
            //add 2 second delay to simulate loading
            const responseData = await sendRequest(`http://localhost:5001/api/v1/carbuilds/user/${props.user}/${followList}`, "GET", null, {
                'Content-Type': 'application/json'
            })

            if (!responseData.error) {
                console.log(responseData.userList)
                return responseData.userList
            }
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(async () => {
        console.log("right here")
        console.log(modalTab)
        if (modalTab === "Followers" && !isFollowersLoaded) {
            const loadedFollowersList = await getListOfUsers("followers")
            setIsFollowersLoaded(true)
            setFollowersList(loadedFollowersList)
        } else if (modalTab === "Following" && !isFollowingLoaded) {
            const loadedFollowingList = await getListOfUsers("following")
            setIsFollowingLoaded(true)
            setFollowingList(loadedFollowingList)
        }
    }, [modalTab])

    function closeModalHandler(){
        props.close()
    }
    return <>
        <Modal
            open={modalOpen}
            onClose={closeModalHandler}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={classes.modal}
        >
            <Box sx={{bgcolor: "white"}}>
                <Tabs value={modalTab} onChange={handleChange} aria-label="basic tabs example">
                    <Tab value={"Followers"} label="Followers" />
                    <Tab value={"Following"} label="Following" />
                </Tabs>
                <TabPanel value={modalTab} index={"Followers"}>

                    {isLoading && <Box textAlign={"center"}>
                        <CircularProgress  />
                        </Box>
                    }
                    {followersList.map((user) => {
                        return <Box sx={{ display: "flex", alignItems: "center"}}><Avatar style={{marginRight: "1rem", width: "3rem", height: "3rem"}} src={caravi}/><Typography >{user.username}</Typography></Box>
                    })}
                </TabPanel>
                <TabPanel value={modalTab} index={"Following"}>
                    {isLoading && <Box textAlign={"center"}><CircularProgress /></Box>}
                    {followingList.map((user) => {
                        return <Box sx={{ display: "flex", alignItems: "center"}}><Avatar style={{marginRight: "1rem", width: "3rem", height: "3rem"}} src={caravi}/><Typography >{user.username}</Typography></Box>
                    })}
                </TabPanel>
            </Box>
        </Modal>
    </>
}