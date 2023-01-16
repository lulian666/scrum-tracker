import { Schema, model, Document } from 'mongoose'

export interface ListInterface {
    title: string
    board: string
}

const ListSchema = new Schema<ListInterface>(
    {
        title: {
            type: Schema.Types.String,
            required: [true, 'Please provide title'],
        },
        board: {
            type: Schema.Types.String,
            ref: 'Scrum',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

export default model<ListInterface>('List', ListSchema)
