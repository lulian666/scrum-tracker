import cloudinary from '@/config/cloudinary.config'
import { UploadedFile } from 'express-fileupload'
import fs from 'fs'

async function uploadScrumLogo(imageFile: UploadedFile) {
    const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        use_filename: true,
        folder: 'scrum-tracker',
    })

    fs.unlinkSync(imageFile.tempFilePath)
    return result
}

export default {
    uploadScrumLogo,
}
