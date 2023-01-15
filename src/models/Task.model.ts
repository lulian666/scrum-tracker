import { Schema, model, Document } from 'mongoose'

export interface TaskInterface extends Document {
    title: string
    description: string
    createdBy: object
    assignTo: object
    attachments: string[]
    status: string
    priority: string
    board: object
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
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        assignTo: {
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
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
