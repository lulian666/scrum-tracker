import { Schema, model, Document } from 'mongoose'

export interface ListInterface {
    title: string
    cards: string[]
}

const ListSchema = new Schema<ListInterface>(
    {
        title: {
            type: String,
            required: [true, 'Please provide title'],
        },
        cards: [
            {
                type: String,
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
