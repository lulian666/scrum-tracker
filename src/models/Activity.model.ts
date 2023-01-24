import { Schema, model } from 'mongoose'

export interface ActivityInterface {
    type: string
    idMember: string
    message: string
    src: string
    name: string
}

const ActivitySchema = new Schema<ActivityInterface>(
    {
        type: {
            type: String,
            required: [true, 'Please provide type'],
            enum: ['image', 'comment'],
        },
        idMember: {
            type: String,
            require: [true, 'Please provide idMember'],
            ref: 'User',
        },
        message: {
            type: String,
            required: [true, 'Please provide message'],
        },
        src: String,
        name: { type: String, default: 'Image' },
    },
    {
        id: true,
        timestamps: {
            updatedAt: false,
            createdAt: true,
        },
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
)

export default model<ActivityInterface>('Activity', ActivitySchema)
