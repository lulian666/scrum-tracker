import cloudinary from '@/config/cloudinary.config'
import { UploadedFile } from 'express-fileupload'
import fs from 'fs'

async function uploadImage(imageFile: UploadedFile) {
    const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        filename_override: imageFile.name,
        folder: 'scrum-tracker',
    })

    fs.unlinkSync(imageFile.tempFilePath)
    return result
}

export default {
    uploadImage,
}
