import VehicleDAO from '../dao/vehiclesDAO.js'

export default class VehciclesController {
    static async apiCreateVehicle(req, res, next) {
        try {
            const { year, make, model, userId } = req.body
            const response = await VehicleDAO.createVehicle(year, make, model, userId)
            res.json(response)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }

    }
    static async apiGetVehicles(req, res, next){
        try{
            const response = await VehicleDAO.getVehicles()
            res.json(response)
        }catch (e){
            res.status(500).json({ error: e.message })
        }
    }
    static async apiGetVehiclesByUserId(req, res, next){
        try{
            const response = await VehicleDAO.getVehiclesByUserId(req.params.id)
            res.json(response)
        }catch (e){
            res.status(500).json({ error: e.message })
        }
    }

}