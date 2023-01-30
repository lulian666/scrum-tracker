import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UploadedFile } from 'express-fileupload'
import uploadsService from '@/services/uploads.service'

const uploadScrumLogo = async (req: Request, res: Response): Promise<void> => {
    const imageFile = req.files!.image as UploadedFile
    const result = await uploadsService.uploadImage(imageFile)
    res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

export default {
    uploadScrumLogo,
}
