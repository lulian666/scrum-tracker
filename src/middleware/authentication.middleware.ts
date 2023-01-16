import { Request, Response, NextFunction } from 'express'
import CustomError from '@/errors/index'
import utils from '../utils'
import { authInfoRequest } from '@/controllers/request.definition'
import Token from '@/models/Token.model'

const authenticateUserBefore = async (
    req: authInfoRequest,
    res: Response,
    next: NextFunction
) => {
    const { refreshToken, accessToken } = req.signedCookies
    try {
        if (accessToken) {
            const payload = utils.isTokenValid(accessToken)
            req.user = (<any>payload).user
            return next()
        }

        const payload = utils.isTokenValid(refreshToken)
        const existingToken = await Token.findOne({
            user: (<any>payload).user.userId,
            refreshToken: (<any>payload).refreshToken,
        })
        if (!existingToken || !existingToken?.isValid) {
            throw new CustomError.UnauthenticatedError('Authentication Invalid')
        }

        utils.attachCookiesToResponse({
            res,
            tokenUser: (<any>payload).user.userId,
            refreshToken: existingToken.refreshToken,
        })

        req.user = (<any>payload).user
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
}

const authenticateUser = async (
    req: authInfoRequest,
    res: Response,
    next: NextFunction
) => {
    // check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]

    try {
        const payload = utils.isTokenValid(token)
        // attach the user to the job routes
        req.user = (<any>payload).user
        console.log('req.user', req.user)
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
}

const authorizePermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //placeholder: should check user permission
}

export default { authenticateUser, authorizePermissions }
