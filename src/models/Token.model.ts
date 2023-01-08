import { Schema, model, Document } from 'mongoose'

interface tokenInterface extends Document {
    refreshToken: string
    ip: string
    userAgent: string
    isValid: boolean
    user: object
}

const TokenSchema = new Schema<tokenInterface>({
    refreshToken: {
        type: Schema.Types.String,
        required: true,
    },
    ip: {
        type: Schema.Types.String,
        required: true,
    },
    userAgent: {
        type: Schema.Types.String,
        required: true,
    },
    isValid: { // user black list
        type: Schema.Types.Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

export default model<tokenInterface>('Token', TokenSchema)
