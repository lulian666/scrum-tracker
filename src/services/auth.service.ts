import User from '@/models/User.model'
import CustomError from '@/errors/index'
import emailEventEmitter from '@/subscribers/email.subscriber'

async function register({
    name,
    email,
    password,
    role,
    verificationToken,
}: {
    name: string
    email: string
    password: string
    role: string
    verificationToken: string
}): Promise<void | Error> {
    // if already reisgtered yet not verified
    const emailAlreadyExist = await User.findOne({ email })
    const eventEmitter = await emailEventEmitter.sendVerificationEmail(email)

    if (emailAlreadyExist && !emailAlreadyExist.isVerified) {
        // update user verificationToken and send verification email again
        await User.findOneAndUpdate(
            { email },
            { verificationToken },
            { new: true, runValidators: true }
        )
        eventEmitter.emit('signup', email)
        return
    }

    if (emailAlreadyExist && emailAlreadyExist.isVerified) {
        throw new CustomError.BadRequestError('Email already in registered')
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken,
    })
    eventEmitter.emit('signup', email)
}

export default { register }
