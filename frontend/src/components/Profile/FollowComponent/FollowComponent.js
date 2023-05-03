import { useState } from "react"
import { useHttpClient } from "../../../hooks/http-hook"
import { Button } from "@material-ui/core"
import { useSelector } from "react-redux"


export default function FollowComponent(props) {
    const { isLoading, httpError, sendRequest } = useHttpClient()
    const [isFollowing, setIsFollowing] = useState(false)
    const authSelector = useSelector(state => state.auth)

    async function followUserHandler(method) {
        try {
            const responseData = await sendRequest(`http://localhost:5001/api/v1/carbuilds/user/${props.userId}/follow/`, method, JSON.stringify({
                userId: authSelector.userId
            }), {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + authSelector.token
            })
            if (!responseData.error) {
                if(method === 'POST'){
                setIsFollowing(true)}
                else{
                    setIsFollowing(false)
                }
            }
        } catch (err) {

        }

    }
    return <>
        {httpError}
        {!isFollowing && <Button variant="contained" disabled={isLoading} onClick={()=>followUserHandler("POST")} >Follow</Button>}
        {isFollowing && <Button variant="contained" disabled={isLoading} onClick={()=> followUserHandler("DELETE") } >Following</Button>}
    </>

}