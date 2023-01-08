import { StatusCodes } from 'http-status-codes'
import CustomError from '@/errors/index'
import { Router, Request, Response, NextFunction } from 'express'
import AuthService from '@/services/auth.service'
import crypto from 'crypto'
import utils from '../utils'
import authService from '@/services/auth.service'
import { authInfoRequest } from './request.definition'
import Token from '@/models/Token.model'

const register = async (
    req: authInfoRequest,
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
        message: 'Please check your email for verification'
    })
}

const login = async (
    req: authInfoRequest,
    res: Response
): Promise<Response | void> => {
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
    await Token.findOneAndDelete({ user: req.user?.userId })
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
    req: authInfoRequest,
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
    res.send('forgotPassword')
}

const resetPassword = async (
    req: authInfoRequest,
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
