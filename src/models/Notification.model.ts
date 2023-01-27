import { Schema, model } from 'mongoose'
import _ from 'lodash'

export interface NotificationInterface {
    icon: string
    title: string
    description: string
    read: boolean
    variant: string
    userId: string
}

const NotificationSchema = new Schema<NotificationInterface>(
    {
        icon: {
            type: String,
            default: 'heroicons-solid:star',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        variant: {
            type: String,
            enum: ['success', 'info', 'error', 'warning', 'default'],
            default: 'default',
        },
        userId: {
            type: String,
            ref: 'User',
        },
    },
    {
        id: true,
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

export function newCardNotification(data: object): NotificationInterface {
    return _.defaults(data, {
        description: 'A new card is created.',
        title: 'Board Activity',
        variant: 'default',
        icon: 'heroicons-solid:star',
        read: false,
        userId: '',
    })
}

export function updateCardNotification(data: object): NotificationInterface {
    return _.defaults(data, {
        description: 'A card is updated on your board.',
        title: 'Board Activity',
        variant: 'default',
        icon: 'heroicons-solid:star',
        read: false,
        userId: '',
    })
}



export default model<NotificationInterface>('Notification', NotificationSchema)
