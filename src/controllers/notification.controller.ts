import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import notificationService from '@/services/notification.service'

const getNotifications = async (req: authInfoRequest, res: Response) => {
    const { userId } = req.user!
    const notifications = await notificationService.getAll(userId)

    // find out if there's any new notifications from last time
    const unreadNotifications = notifications.filter(
        (notification) => notification.read === false
    )

    const hasNew = unreadNotifications.length ? true : false

    res.status(StatusCodes.OK).json({ notifications, hasNew })
}

const createNotification = async (req: authInfoRequest, res: Response) => {
    const { userId } = req.user!
    const notification = await notificationService.createNotification({
        ...req.body,
        userId,
    })
    return res.status(StatusCodes.CREATED).json({ notification })
}

const readNotifications = async (req: authInfoRequest, res: Response) => {
    const { userId } = req.user!
    await notificationService.readAll(userId)
    res.status(StatusCodes.OK).json({})
}

export default { getNotifications, createNotification, readNotifications }
