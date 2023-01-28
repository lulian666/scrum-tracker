import Notification, {
    newCardNotification,
    updateCardNotification,
} from '@/models/Notification.model'
import EventEmitter from 'events'
import UserBoardSubscription, {
    UserBoardSubscriptionInterface,
} from '@/models/UserBoardNotification.model'

const eventEmitter = new EventEmitter()

// send notification to users who subscribed the board
// except for the one who create the card
async function sendNewCardNotification(
    boardId: string,
    cardTitle: string,
    creator: string
) {
    // get all users who subcribed the scrum
    const userBoardNotifications = await UserBoardSubscription.find({
        boardId,
        subscription: true,
    })
    const userIds = userBoardNotifications
        .map((each) => each.userId)
        .filter((each) => each !== creator)

    // get notification data
    const cardTitleShortened =
        cardTitle.length > 15 ? cardTitle.slice(0, 15) + '...' : cardTitle
    const notificationDatas = userIds.map((userId) =>
        newCardNotification({
            userId,
            description: `A new Card '${cardTitleShortened}' is created.`,
        })
    )

    // create notifications
    await Notification.insertMany(notificationDatas)

    // todo: push
}

async function sendUpdateCardNotification(
    boardId: string,
    cardTitle: string,
    creator: string
) {
    const userBoardNotifications = await UserBoardSubscription.find({
        boardId,
        subscription: true,
    })
    const userIds = userBoardNotifications
        .map((each) => each.userId)
        .filter((each) => each !== creator)

    const cardTitleShortened =
        cardTitle.length > 20 ? cardTitle.slice(0, 20) + '...' : cardTitle
    const notificationDatas = userIds.map((userId) =>
        updateCardNotification({
            userId,
            description: `Card '${cardTitleShortened}' is updated.`,
        })
    )

    await Notification.insertMany(notificationDatas)

    // todo: push
}

eventEmitter.on('newCard', sendNewCardNotification)
eventEmitter.on('updateCard', sendUpdateCardNotification)

export default eventEmitter
