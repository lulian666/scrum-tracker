import { Schema, model, Document } from 'mongoose'

interface TokenInterface extends Document {
    refreshToken: string
    ip: string
    userAgent: string
    isValid: boolean
    user: string
}

const TokenSchema = new Schema<TokenInterface>(
    {
        refreshToken: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
        isValid: {
            // user black list
            type: Boolean,
            default: true,
        },
        user: {
            type: String,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
)

export default model<TokenInterface>('Token', TokenSchema)
