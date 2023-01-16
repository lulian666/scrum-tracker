import { Schema, model, Document } from 'mongoose'

export interface BoardInterface {
    logo: string
    title: string
    description: string
    members: string[]
    manager: string
    lists: string[]
}

const BoardSchema = new Schema<BoardInterface>(
    {
        logo: {
            type: Schema.Types.String,
            required: [true, 'Please provide logo'],
        },
        title: {
            type: Schema.Types.String,
            required: [true, 'Please provide name'],
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
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

export default model<BoardInterface>('Board', BoardSchema)
