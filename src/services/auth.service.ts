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
}: {
    name: string
    email: string
    password: string
    role: string
}): Promise<userInterface> {
    // if already reisgtered yet not verified
    const emailAlreadyExist = await User.findOne({ email })
    const eventEmitter = emailEventEmitter.sendVerificationEmail()
    const verificationToken = crypto.randomBytes(40).toString('hex')

    if (emailAlreadyExist && !emailAlreadyExist.isVerified) {
        // update user verificationToken and send verification email again
        const user = await User.findOneAndUpdate(
            { email },
            { verificationToken },
            { new: true, runValidators: true }
        )
        eventEmitter.emit('signup', email)
        return user!
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
    if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError(
            'Please verify your email first'
        )
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid email and password')
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

async function verifyEmail({
    verificationToken,
    email,
}: {
    verificationToken: string
    email: string
}): Promise<userInterface> {
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.UnauthenticatedError('Verification failed')
    }

    // if already verified
    if (user.isVerified) {
        return user
    }

    if (user.verificationToken !== verificationToken) {
        throw new CustomError.UnauthenticatedError('Verification failed')
    }

    user.isVerified = true
    user.verifiedDate = new Date(Date.now())
    user.verificationToken = ''
    await user.save()
    return user
}

async function logout(userId: string): Promise<void> {
    if (userId) {
        await Token.findOneAndDelete({ user: userId })
    }
    return
}

async function forgotPassword(email: string): Promise<userInterface | null> {
    let user = await User.findOne({ email })
    if (user && user?.isVerified) {
        const passwordToken = crypto.randomBytes(70).toString('hex')
        const origin = process.env.ORIGIN
        const eventEmitter = await emailEventEmitter.sendResetPasswordEmail()
        eventEmitter.emit('reset', { email, passwordToken })

        const tenMinutes = 1000 * 60 * 10
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

        user.passwordToken = utils.hashString(passwordToken)
        user.passwordTokenExpirationDate = passwordTokenExpirationDate
        user = await user.save()
    }
    return user
}

async function resetPassword({
    token,
    email,
    newPassword,
}: {
    token: string
    email: string
    newPassword: string
}): Promise<userInterface | null> {
    let user = await User.findOne({ email })
    if (user) {
        const currentDate = new Date()
        if (
            user.passwordToken === utils.hashString(token) &&
            user.passwordTokenExpirationDate > currentDate
        ) {
            user.password = newPassword
            user.passwordToken = ''
            user = await user.save()
        }
    }
    return user
}

export default {
    register,
    login,
    verifyEmail,
    logout,
    forgotPassword,
    resetPassword,
}
