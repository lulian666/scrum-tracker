import UserBoardSubscription, {
    UserBoardSubscriptionInterface,
} from '@/models/UserBoardNotification.model'
import CustomError from '@/errors/index'

// internal services
async function create(userId: string, boardId: string) {
    const userBoardNotification = await UserBoardSubscription.create({
        userId,
        boardId,
    })
    return userBoardNotification
}

// internal services
async function getOne(userId: string, boardId: string) {
    return await UserBoardSubscription.findOneAndUpdate(
        { userId, boardId },
        {},
        {
            upsert: true,
            new: true,
        }
    )
}

async function updateOne(
    userId: string,
    boardId: string,
    subscription: boolean
) {
    return await UserBoardSubscription.findOneAndUpdate(
        { userId, boardId },
        { subscription },
        {
            upsert: true,
            new: true,
            runValidators: true,
        }
    )
}

export default {
    create,
    getOne,
    updateOne,
}
