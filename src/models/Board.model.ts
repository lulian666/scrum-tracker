import { Schema, model, Document } from 'mongoose'

export interface BoardInterface {
    icon: string
    title: string
    description: string
    members: string[]
    manager: string
    lists: string[]
}

const BoardSchema = new Schema<BoardInterface>(
    {
        icon: {
            type: String,
            required: [true, 'Please provide icon'],
        },
        title: {
            type: String,
            required: [true, 'Please provide title'],
        },
        description: {
            type: String,
            default: 'This is a board description',
        },
        members: [
            {
                type: String,
                ref: 'User',
            },
        ],
        manager: {
            // default creator
            type: String,
            ref: 'User',
            required: true,
        },
        lists: [
            {
                type: String,
                ref: 'List',
            },
        ],
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
    }
)

BoardSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    },
})

export default model<BoardInterface>('Board', BoardSchema)
