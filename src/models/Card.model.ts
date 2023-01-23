import { Schema, model, Document } from 'mongoose'

export interface CardInterface {
    name: string
    title: string
    description: string
    attachments: string[]
    // createdBy: string
    // assignTo: string
    // priority: string
    activities: string[]
}

const CardSchema = new Schema<CardInterface>(
    {
        name: {
            type: String,
            // required: [true, 'Please provide name'],
        },
        title: {
            type: String,
            required: [true, 'Please provide title'],
        },
        description: {
            type: String,
            maxlength: 400,
        },
        // createdBy: {
        //     type: String,
        //     ref: 'User',
        // },
        // assignTo: {
        //     type: String,
        //     ref: 'User',
        // },
        attachments: [
            {
                type: String,
            },
        ],
        // priority: {
        //     type: String,
        //     enum: {
        //         values: ['high', 'normal', 'low'],
        //         message: '{VALUE} is not supported',
        //     },
        //     default: 'normal',
        // },
        activities: [
            {
                type: String,
                ref: 'Activity',
            },
        ],
    },
    {
        timestamps: {
            updatedAt: false,
            createdAt: true,
        },
        toObject: { virtuals: true },
    }
)

CardSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    },
})

export default model<CardInterface>('Card', CardSchema)
