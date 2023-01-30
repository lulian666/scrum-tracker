import Notification, {
    NotificationInterface,
} from '@/models/Notification.model'

async function getAll(userId: string) {
    const notifications = await Notification.find({
        userId,
    }).sort('-createdAt')
    return notifications
}

// internal service
async function createNotification(data: NotificationInterface) {
    const notification = await Notification.create(data)
    return notification
}

async function readAll(userId: string) {
    await Notification.updateMany({ userId }, { read: true })
}

export default {
    getAll,
    createNotification,
    readAll,
}
