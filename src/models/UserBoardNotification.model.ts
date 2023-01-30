import { Schema, model } from 'mongoose'

export interface UserBoardSubscriptionInterface {
    userId: string
    boardId: string
    subscription: boolean
}

const UserBoardSubscriptionSchema = new Schema<UserBoardSubscriptionInterface>(
    {
        userId: {
            type: String,
            required: true,
            ref: 'User',
        },
        boardId: {
            type: String,
            required: true,
            ref: 'Board',
        },
        subscription: {
            type: Boolean,
            default: true,
        },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
)

UserBoardSubscriptionSchema.index({ userId: 1, boardId: 1 }, { unique: true })

export default model<UserBoardSubscriptionInterface>(
    'UserBoardSubscription',
    UserBoardSubscriptionSchema
)
