import { Schema, model } from 'mongoose'

export interface CardInterface {
    title: string
    description: string
    attachments: string[]
    activities: string[]
}

const CardSchema = new Schema<CardInterface>(
    {
        title: {
            type: String,
            required: [true, 'Please provide title'],
        },
        description: {
            type: String,
            maxlength: 400,
        },
        attachments: [
            {
                type: String,
                ref: 'Activity',
            },
        ],
        activities: [
            {
                type: String,
                ref: 'Activity',
            },
        ],
    },
    {
        timestamps: {
            updatedAt: false,
            createdAt: true,
        },
        toObject: { virtuals: true },
    }
)

CardSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    },
})

export default model<CardInterface>('Card', CardSchema)
