import { Schema, model, Document } from 'mongoose'

export interface ListInterface {
    title: string
    // don't think we need this in mongo
    // boardId: string
    cards: string[]
}

const ListSchema = new Schema<ListInterface>(
    {
        title: {
            type: Schema.Types.String,
            required: [true, 'Please provide title'],
        },
        // boardId: {
        //     type: Schema.Types.String,
        //     ref: 'Board',
        //     required: true,
        // },
        cards: [
            {
                type: Schema.Types.String,
                ref: 'Card',
            },
        ],
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
    }
)

ListSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    },
})

export default model<ListInterface>('List', ListSchema)
