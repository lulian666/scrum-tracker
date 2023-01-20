import { Schema, model } from 'mongoose'

export interface ActivityInterface {
    type: string
    idMember: string
    message: string
    time: string
}

const ActivitySchema = new Schema<ActivityInterface>(
    {
        type: {
            type: String,
            required: [true, 'Please provide type'],
            enum: ['attachment', 'comment'],
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
        time: {
            type: String,
            required: true,
        },
    },
    {
        id: true,
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
)

export default model<ActivityInterface>('Activity', ActivitySchema)
