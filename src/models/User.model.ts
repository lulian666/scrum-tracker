import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface userInterface extends Document {
    name: string
    email: string
    password: string
    role: string
    verificationToken: string
    isVerified: boolean
    verifiedDate: Date
    passwordToken: string
    passwordTokenExpirationDate: Date
    comparePassword(password: string): Promise<Error | boolean>
}

const UserSchema = new Schema<userInterface>({
    name: {
        type: Schema.Types.String,
        required: [true, 'Please provide name'],
    },
    email: {
        type: Schema.Types.String,
        unique: true,
        required: [true, 'Please provide email'],
    },
    password: {
        type: Schema.Types.String,
        required: [true, 'Please provide password'],
    },
    role: {
        type: Schema.Types.String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    verificationToken: {
        type: Schema.Types.String,
    },
    isVerified: {
        type: Schema.Types.Boolean,
        default: false,
    },
    verifiedDate: {
        type: Schema.Types.Date,
    },
    passwordToken: {
        type: Schema.Types.String,
    },
    passwordTokenExpirationDate: {
        type: Schema.Types.Date,
    },
})

UserSchema.pre<userInterface>('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<Error | boolean> {
    return await bcrypt.compare(candidatePassword, this.password)
}

export default model<userInterface>('User', UserSchema)
