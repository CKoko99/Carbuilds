import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHttpClient } from '../../hooks/http-hook'
import ImageUpload from '../shared/Imageupload/ImageUpload'
import classes from './Post.module.css'

function CreatePost() {
    const [userVehicles, setUserVehicles] = useState([])
    const authSelector= useSelector(state=> state.auth)
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const titleRef = useRef()
    const descriptionRef =useRef()
    const vehicleRef =useRef()

    async function getVehiclesHandler(){
        try {
            const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/vehicles/'+ authSelector.userId, 'GET',null, {
                'Content-Type': 'application/json'
            })
    
            console.log("vehicles")
            console.log(responseData)
            setUserVehicles(responseData.vehiclesList)
            console.log("here we are")
            console.log(responseData.vehiclesList)
        } catch (err) {
        }
    }
    useEffect(()=>{
        if(authSelector.userId){
            getVehiclesHandler()
        }
    },[authSelector.userId])
    const Vehicles = userVehicles.map(vehicle =>{
        return <option value={vehicle._id}>{vehicle.year} {vehicle.make} {vehicle.model}</option>
    })
    async function submitPostHandler(){
        console.log("here")
        try {
            const responseData = await sendRequest('http://localhost:5001/api/v1/carbuilds/posts/', 'POST',JSON.stringify({
                userId: authSelector.userId,
                title: titleRef.current.value,
                vehicle: vehicleRef.current.value,
                description: descriptionRef.current.value,
            }), {
                'Content-Type': 'application/json'
            })
    
            console.log(responseData)
        } catch (err) {
        }
    }
    return <>
        <div className={classes['Post']}>
            <div className={classes['post-heading']}>Create New Post</div>
            <ImageUpload onInput={()=>{return}}/>
            <div className={classes['post-section']}>
                <label>Title:</label>
                <input ref={titleRef}></input>
            </div>
            <div className={classes['post-section']}>
                <label>Description:</label>
                <input ref={descriptionRef}></input>
            </div>
            <div className={classes['post-section']}>
                <label>Select a Vehicle:</label>
                <select ref={vehicleRef}>
                    <option value="-1">No Vehicle</option>
                    {Vehicles}
                </select>
            </div>
            <button onClick={submitPostHandler}>Submit</button>
        </div>
    </>
}
export default CreatePost