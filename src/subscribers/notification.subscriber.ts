import Notification, {
    newCardNotification,
    updateCardNotification,
} from '@/models/Notification.model'
import EventEmitter from 'events'
import UserBoardSubscription from '@/models/UserBoardNotification.model'

const eventEmitter = new EventEmitter()

async function sendNotification(
    boardId: string,
    cardTitle: string,
    creator: string,
    type: string
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

    let notificationDatas = {}
    if (type === 'update') {
        notificationDatas = userIds.map((userId) =>
            updateCardNotification({
                userId,
                description: `Card '${cardTitleShortened}' is updated.`,
            })
        )
    }
    if (type === 'create') {
        notificationDatas = userIds.map((userId) =>
            newCardNotification({
                userId,
                description: `A new Card '${cardTitleShortened}' is created.`,
            })
        )
    }

    await Notification.insertMany(notificationDatas)

    // todo: push
}

// send notification to users who subscribed the board
// except for the one who create the card
async function sendNewCardNotification(
    boardId: string,
    cardTitle: string,
    creator: string
) {
    sendNotification(boardId, cardTitle, creator, 'create')
}

async function sendUpdateCardNotification(
    boardId: string,
    cardTitle: string,
    creator: string
) {
    sendNotification(boardId, cardTitle, creator, 'update')
}

eventEmitter.on('newCard', sendNewCardNotification)
eventEmitter.on('updateCard', sendUpdateCardNotification)

export default eventEmitter
