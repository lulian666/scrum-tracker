import { Schema, model, Document } from 'mongoose'

export interface BoardInterface extends Document {
    name: string
    scrum: object
}

const BoardSchema = new Schema<BoardInterface>(
    {
        name: {
            type: Schema.Types.String,
            required: [true, 'Please provide name'],
        },
        scrum: {
            type: Schema.Types.ObjectId,
            ref: 'Scrum',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

export default model<BoardInterface>('Board', BoardSchema)
