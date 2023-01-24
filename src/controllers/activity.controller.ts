import { authInfoRequest } from './request.definition'
import { Response } from 'express'
import activityService from '@/services/activity.service'
import { StatusCodes } from 'http-status-codes'
import { UploadedFile } from 'express-fileupload'
import uploadsService from '@/services/uploads.service'

const createComment = async (req: authInfoRequest, res: Response) => {
    const { boardId, cardId } = req.params
    const { type, idMember, message } = req.body
    const commentActivity = await activityService.createComment(cardId, {
        type,
        idMember,
        message,
        src: '',
        name: '',
    })
    res.status(StatusCodes.CREATED).json({ comment: commentActivity })
}

const createAttachment = async (req: authInfoRequest, res: Response) => {
    const { boardId, cardId } = req.params
    const { type, idMember, message } = req.body

    // creating attachment is not just about activity record
    // have to literally upload file to a cloud server
    const imageFile = req.files!.file as UploadedFile
    const result = await uploadsService.uploadImage(imageFile)
    const { secure_url: src, original_filename: name } = result

    const attachmentActivity = await activityService.createAttachment(cardId, {
        type,
        idMember,
        message,
        src,
        name,
    })
    res.status(StatusCodes.CREATED).json({ attachment: attachmentActivity })
}

const deleteAttachment = async (req: authInfoRequest, res: Response) => {
    const { cardId, attachmentId } = req.params
    await activityService.deleteAttachment(
        cardId,
        attachmentId,
        req.user!.userId
    )
    res.status(StatusCodes.OK).json({})
}

export default {
    createComment,
    createAttachment,
    deleteAttachment,
}
