import { Schema, model, Document } from 'mongoose'

export interface ScrumInterface {
    logo: string
    name: string
    description: string
    members: string[]
    manager: string
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
        },
        description: {
            type: Schema.Types.String,
            default: 'This is a scrum description',
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

export default model<ScrumInterface>('Scrum', ScrumSchema)
