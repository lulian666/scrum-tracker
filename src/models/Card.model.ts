import { Schema, model, Document } from 'mongoose'

export interface CardInterface {
    name: string
    boardId: string
    listId: string
    title: string
    description: string
    attachments: string[]
    createdBy: string
    assignTo: string
    status: string
    priority: string
}

const CardSchema = new Schema<CardInterface>(
    {
        name: {
            type: Schema.Types.String,
            required: [true, 'Please provide name'],
        },
        boardId: {
            type: Schema.Types.String,
            ref: 'Board',
            required: [true, 'Please provide board id'],
        },
        listId: {
            type: Schema.Types.String,
            ref: 'listId',
            required: [true, 'Please provide list id'],
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
        status: {
            type: Schema.Types.String,
            enum: {
                values: ['open', 'resolved', 'invalid', 'wontfix'],
                message: '{VALUE} is not supported',
            },
            default: 'open',
        },
        priority: {
            type: Schema.Types.String,
            enum: {
                values: ['high', 'normal', 'low'],
                message: '{VALUE} is not supported',
            },
            default: 'normal',
        },
        // board: {
        //     type: Schema.Types.String,
        //     ref: 'Board',
        //     required: [true, 'Please provide board'],
        // },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

export default model<CardInterface>('Card', CardSchema)
