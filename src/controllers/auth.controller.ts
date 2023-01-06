import { StatusCodes } from "http-status-codes"
import CustomError from '@/errors/index'
import { Router, Request, Response, NextFunction } from 'express'
import AuthService from "@/services/auth.service"
import crypto from 'crypto'

const register = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, name, password } = req.body
    const verificationToken = crypto.randomBytes(40).toString('hex')

    await AuthService.register({ email, name, password, role: 'user', verificationToken })

    res.status(StatusCodes.CREATED).json({ message: 'Please check your email for verification' })
}

const login = async (req: Request, res: Response): Promise<Response | void> => {
    res.send('login')
}

const logout = async (req: Request, res: Response): Promise<Response | void> => {
    res.send('logout')
}

const verifyEmail = async (req: Request, res: Response): Promise<Response | void> => {
    res.send('verifyEmail')
}

const forgotPassword = async (req: Request, res: Response): Promise<Response | void> => {
    res.send('forgotPassword')
}

const resetPassword = async (req: Request, res: Response): Promise<Response | void> => {
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