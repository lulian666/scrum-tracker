import User, { userInterface } from '@/models/User.model'
import Token from '@/models/Token.model'
import CustomError from '@/errors/index'
import emailEventEmitter from '@/subscribers/email.subscriber'
import utils from '../utils'
import crypto from 'crypto'

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
}): Promise<userInterface | null> {
    // if already reisgtered yet not verified
    const emailAlreadyExist = await User.findOne({ email })
    const eventEmitter = await emailEventEmitter.sendVerificationEmail(email)

    if (emailAlreadyExist && !emailAlreadyExist.isVerified) {
        // update user verificationToken and send verification email again
        const user = await User.findOneAndUpdate(
            { email },
            { verificationToken },
            { new: true, runValidators: true }
        )
        eventEmitter.emit('signup', email)
        return user
    }

    if (emailAlreadyExist && emailAlreadyExist.isVerified) {
        throw new CustomError.BadRequestError('Email already registered')
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken,
    })
    eventEmitter.emit('signup', email)
    return user
}

async function login({
    email,
    password,
    userAgent,
    ip,
}: {
    email: string
    password: string
    userAgent: string
    ip: string
}): Promise<{ tokenUser: any; refreshToken: string }> {
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid email and password')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid email and password')
    }
    if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError(
            'Please verify your email first'
        )
    }

    //create token
    const tokenUser = utils.createTokenUser(user)
    let refreshToken = ''
    const existingToken = await Token.findOne({ user: user._id })
    if (existingToken) {
        const { isValid } = existingToken
        if (!isValid) {
            throw new CustomError.UnauthenticatedError(
                'Invalid email and password'
            )
        }

        refreshToken = existingToken.refreshToken
        return { tokenUser, refreshToken }
    }

    refreshToken = crypto.randomBytes(40).toString('hex')
    await Token.create({ refreshToken, ip, userAgent, user: user._id })

    return { tokenUser, refreshToken }
}

export default { register, login }
