import { StatusCodes } from 'http-status-codes'
import CustomError from '@/errors/index'
import { Router, Request, Response, NextFunction } from 'express'
import AuthService from '@/services/auth.service'
import crypto from 'crypto'
import utils from '../utils'
import authService from '@/services/auth.service'

const register = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    const { email, name, password } = req.body
    const verificationToken = crypto.randomBytes(40).toString('hex')

    const user = await AuthService.register({
        email,
        name,
        password,
        role: 'user',
        verificationToken,
    })

    res.status(StatusCodes.CREATED).json({
        message: 'Please check your email for verification',
        user,
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
    console.log(refreshToken, tokenUser)
    utils.attachCookiesToResponse({ res, tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    res.send('logout')
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
    req: Request,
    res: Response
): Promise<Response | void> => {
    res.send('forgotPassword')
}

const resetPassword = async (
    req: Request,
    res: Response
): Promise<Response | void> => {
    res.send('resetPassword')
}

export default {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}
