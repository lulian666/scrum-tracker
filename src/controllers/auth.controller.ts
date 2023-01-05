import { StatusCodes } from "http-status-codes"
import CustomError from '@/errors/index'
import { Router, Request, Response, NextFunction } from 'express'

const register = async (req: Request, res: Response): Promise<Response | void> => {
    res.send('register')
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