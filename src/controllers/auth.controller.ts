import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import utils from '../utils'
import authService from '@/services/auth.service'
import { authInfoRequest } from './request.definition'

const register = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    const { email, name, password } = req.body

    const user = await authService.register({
        email,
        name,
        password,
        role: 'user',
    })

    res.status(StatusCodes.CREATED).json({
        message: 'Please check your email for verification',
    })
}

const login = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, password } = req.body
    const userAgent = String(req.header('user-agent'))
    const ip = req.ip
    const { tokenUser, refreshToken } = await authService.login({
        email,
        password,
        userAgent,
        ip,
    })

    utils.attachCookiesToResponse({ res, tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (
    req: authInfoRequest,
    res: Response
): Promise<Response | void> => {
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

const verifyEmail = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    const { verificationToken, email } = req.body
    const user = await authService.verifyEmail({ verificationToken, email })

    res.status(StatusCodes.OK).json({ message: 'verified' })
}

const forgotPassword = async (
    req: authInfoRequest,
    res: Response
): Promise<Response | void> => {
    const { email } = req.body
    await authService.forgotPassword(email)

    res.status(StatusCodes.OK).json({
        message: 'Please check your email for reset password link',
    })
}

const resetPassword = async (
    req: authInfoRequest,
    res: Response
): Promise<Response | void> => {
    const { token, email, newPassword } = req.body
    await authService.resetPassword({ token, email, newPassword })
    res.status(StatusCodes.OK).send({ msg: 'Password changed' })
}

export default {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}
