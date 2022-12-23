import mongoose from 'mongoose'

const Schema = mongoose.Schema

const VehicleSchema = new Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

export default mongoose.model('Vehicle', VehicleSchema)