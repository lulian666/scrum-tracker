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
            type: Schema.Types.String,
            required: [true, 'Please provide icon'],
        },
        title: {
            type: Schema.Types.String,
            required: [true, 'Please provide title'],
        },
        description: {
            type: Schema.Types.String,
            default: 'This is a board description',
        },
        members: [
            {
                type: Schema.Types.String,
                ref: 'User',
            },
        ],
        manager: {
            // default creator
            type: Schema.Types.String,
            ref: 'User',
            required: true,
        },
        lists: [
            {
                type: Schema.Types.String,
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
