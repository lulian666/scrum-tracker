import { Schema, model, Document } from 'mongoose'

export interface ListInterface {
    title: string
    boardId: string
    cards: string[]
}

const ListSchema = new Schema<ListInterface>(
    {
        title: {
            type: Schema.Types.String,
            required: [true, 'Please provide title'],
        },
        boardId: {
            type: Schema.Types.String,
            ref: 'Board',
            required: true,
        },
        cards: [
            {
                type: Schema.Types.String,
                ref: 'Card',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

export default model<ListInterface>('List', ListSchema)
