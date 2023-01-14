import { Request, Response, NextFunction } from 'express'
import CustomError from '@/errors/index'

const shouldAttachImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const attachedImage = req.files?.image
    if (!attachedImage) {
        throw new CustomError.BadRequestError('Please upload image')
    }
    if (Array.isArray(attachedImage)) {
        throw new CustomError.BadRequestError('Please upload only one image')
    }

    const maxSize = 1024 * 1024 * 10
    if (attachedImage.size > maxSize) {
        throw new CustomError.BadRequestError(
            'Please upload image smaller than 10M'
        )
    }
    next()
}

export default {
    shouldAttachImage,
}
