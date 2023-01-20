import { authInfoRequest } from './request.definition'
import { Response } from 'express'
import activityService from '@/services/activity.service'
import { StatusCodes } from 'http-status-codes'

const createComment = async (req: authInfoRequest, res: Response) => {
    const { boardId, cardId } = req.params
    const { type, idMember, message, time } = req.body
    const commentActivity = await activityService.createComment(cardId, {
        type,
        idMember,
        message,
        time,
    })
    res.status(StatusCodes.CREATED).json({ comment: commentActivity })
}

export default {
    createComment,
}
