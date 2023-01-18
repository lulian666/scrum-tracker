import { Schema, model, Document } from 'mongoose'

export interface CardInterface {
    name: string
    // don't think we need this in mongo
    // boardId: string
    // listId: string
    title: string
    description: string
    attachments: string[]
    createdBy: string
    assignTo: string
    // status: string
    priority: string
}

const CardSchema = new Schema<CardInterface>(
    {
        name: {
            type: Schema.Types.String,
            // required: [true, 'Please provide name'],
        },
        title: {
            type: Schema.Types.String,
            required: [true, 'Please provide title'],
        },
        description: {
            type: Schema.Types.String,
            maxlength: 400,
        },
        createdBy: {
            type: Schema.Types.String,
            ref: 'User',
        },
        assignTo: {
            type: Schema.Types.String,
            ref: 'User',
        },
        attachments: [
            {
                type: Schema.Types.String,
            },
        ],
        // status: {
        //     type: Schema.Types.String,
        //     enum: {
        //         values: ['open', 'resolved', 'invalid', 'wontfix'],
        //         message: '{VALUE} is not supported',
        //     },
        //     default: 'open',
        // },
        priority: {
            type: Schema.Types.String,
            enum: {
                values: ['high', 'normal', 'low'],
                message: '{VALUE} is not supported',
            },
            default: 'normal',
        },
    },
    {
        timestamps: true,
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
