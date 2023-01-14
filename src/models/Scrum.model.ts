import { Schema, model, Document } from 'mongoose'

export interface ScrumInterface extends Document {
    logo: string
    name: string
    description: string
    members: object[]
    manager: object
}

const ScrumSchema = new Schema<ScrumInterface>(
    {
        logo: {
            type: Schema.Types.String,
            required: [true, 'Please provide logo'],
        },
        name: {
            type: Schema.Types.String,
            required: [true, 'Please provide name'],
            unique: true,
        },
        description: {
            type: Schema.Types.String,
            default: 'This is a scrum description',
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        manager: {
            // default creator
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
)

export default model<ScrumInterface>('Scrum', ScrumSchema)
