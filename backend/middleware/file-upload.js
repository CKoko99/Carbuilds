import Multer from 'multer'
import {v1 as uuid} from 'uuid'

const MIME_TYPE_MAP ={
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}
const fileupload = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
    },
  });
export default fileupload

