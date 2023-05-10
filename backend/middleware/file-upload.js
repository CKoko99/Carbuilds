import multer from 'multer'
import {v1 as uuid} from 'uuid'

const MIME_TYPE_MAP ={
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}
const fileupload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, 'uploads/images')
        },
        filename: (req, file, cb) =>{
            const ext = MIME_TYPE_MAP[file.mimetype]
            cb(null, uuid()+'.'+ext )
        }
    }),
    fileFilter: (req, file, cb)=>{
        console.log("upload")
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isValid ? null : new Error("invalid Mime type")
        cb(error, isValid)
    }
})
export default fileupload

