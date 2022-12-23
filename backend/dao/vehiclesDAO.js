import User from '../models/Schemas/Users.js'
import Vehichle from '../models/Schemas/Vehicles.js'
import mongoose from 'mongoose'
import { response } from 'express'
import mongoDB from 'mongodb'
import HttpError from '../models/httpError.js'
import Vehicles from '../models/Schemas/Vehicles.js'


export default class vehicleDAO{
    static async createVehicle(year, make, model, creator, next) {
        let userMatch
        try {
            userMatch = await User.findById(creator)
            if (!userMatch) {

                console.log("userMatch")
                throw new HttpError("Could not find user to create Vehicle", 422)
            }
            const newVehicle = new Vehichle({
                year,
                make,
                model,
                creator
            })
            try{
                const sess = await mongoose.startSession()
                sess.startTransaction()
                await newVehicle.save({ session: sess })
                userMatch.vehicles.push(newVehicle)
                await userMatch.save({ session: sess })
                await sess.commitTransaction()
                return newVehicle
            }catch(e){
                return {error: e}
            }
        } catch (e) {
            console.error(`Unable to create user: ${e}`)
            return { error: { message: e.message, code: e.code } }
        }
    }
    static async getVehicles(){
        let allVehciles
        try{
            allVehciles = await Vehicles.find()
            const vehiclesList = allVehciles.map(car => car.toObject())
            return {vehiclesList, totalVehicles: vehiclesList.length}
        }catch (e){
            return{ error: e}
        }
    }
    static async getVehiclesByUserId(userId){
        let allVehciles
        try{
            allVehciles = await Vehicles.find({creator: userId})
            const vehiclesList = allVehciles.map(car => car.toObject())
            return {vehiclesList, totalVehicles: vehiclesList.length}
        }catch (e){
            return{ error: e}
        }
    }
}