import { StatusCodes } from "http-status-codes"
import CustomError from '../errors'
import { Router, Request, Response, NextFunction } from 'express'

const resgister = async (req: Request, res: Response): Promise<Response | void> => {
    res.send('register')
}


export default {
    resgister,
}