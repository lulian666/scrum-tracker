import { Schema, model, Document } from 'mongoose'

export interface TaskInterface {
    title: string
    description: string
    createdBy: string
    assignTo: string
    attachments: string[]
    status: string
    priority: string
    board: string
}

const TaskSchema = new Schema<TaskInterface>(
    {
        title: {
            type: Schema.Types.String,
            required: [true, 'Please provide title'],
        },
        description: {
            type: Schema.Types.String,
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
        board: {
            type: Schema.Types.String,
            ref: 'Board',
            required: [true, 'Please provide board'],
        },
    },
    {
        timestamps: true,
        // toJSON: { virtuals: true },
        // toObject: { virtuals: true },
    }
)

export default model<TaskInterface>('Task', TaskSchema)
