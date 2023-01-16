import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface UserInterface extends Document {
    name: string
    email: string
    password: string
    role: string
    verificationToken: string
    isVerified: boolean
    verifiedDate: Date
    passwordToken: string
    passwordTokenExpirationDate: Date
    from: string
    comparePassword(password: string): Promise<Error | boolean>
}

const UserSchema = new Schema<UserInterface>(
    {
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
        from: {
            type: Schema.Types.String,
            default: 'from',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

UserSchema.virtual('data').get(function () {
    return {
        displayName: this.name,
        email: this.email,
    }
})

UserSchema.virtual('uuid').get(function () {
    return this._id
})

UserSchema.pre<UserInterface>('save', async function (next) {
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

export default model<UserInterface>('User', UserSchema)
