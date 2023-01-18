import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import authService from '@/services/auth.service'
import { authInfoRequest } from './request.definition'
import utils from '@/utils/index'

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, displayName: name, password } = req.body

    const { safeUser, accessToken } = await authService.register({
        email,
        name,
        password,
        role: 'user',
    })

    res.status(StatusCodes.CREATED).json({
        message: 'Please check your email for verification',
        user: safeUser,
        access_token: accessToken,
    })
}

const loginin = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userAgent = String(req.header('user-agent'))
    const ip = req.ip

    const { safeUser, accessToken } = await authService.login({
        email,
        password,
        userAgent,
        ip,
    })
    res.status(200).json({ access_token: accessToken, user: safeUser })
}

const loginWithAccessToken = async (req: authInfoRequest, res: Response) => {
    const accessToken = await authService.loginWithAccessToken(req.user)
    res.status(StatusCodes.OK).json({
        user: req.user,
        access_token: accessToken,
    })
}

// const login = async (req: Request, res: Response): Promise<void> => {
//     const { email, password } = req.body
//     const userAgent = String(req.header('user-agent'))
//     const ip = req.ip
//     const { tokenUser, refreshToken } = await authService.login({
//         email,
//         password,
//         userAgent,
//         ip,
//     })

//     utils.attachCookiesToResponse({ res, tokenUser, refreshToken })
//     res.status(StatusCodes.OK).json({ user: tokenUser })
// }

const logout = async (req: authInfoRequest, res: Response): Promise<void> => {
    await authService.logout(req.user!.userId)
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({ msg: 'User logged out!' })
}

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { verificationToken, email } = req.body
    await authService.verifyEmail({ verificationToken, email })

    res.status(StatusCodes.OK).json({ message: 'verified' })
}

const forgotPassword = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { email } = req.body
    await authService.forgotPassword(email)

    res.status(StatusCodes.OK).json({
        message: 'Please check your email for reset password link',
    })
}

const resetPassword = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { token, email, newPassword } = req.body
    await authService.resetPassword({ token, email, newPassword })
    res.status(StatusCodes.OK).send({ msg: 'Password changed' })
}

export default {
    register,
    // login,
    loginin,
    loginWithAccessToken,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}
