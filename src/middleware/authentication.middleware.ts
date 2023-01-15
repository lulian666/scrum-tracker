import { Request, Response, NextFunction } from 'express'
import CustomError from '@/errors/index'
import utils from '../utils'
import { authInfoRequest } from '@/controllers/request.definition'
import Token from '@/models/Token.model'

const authenticateUser = async (
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

const authorizePermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //placeholder: should check user permission
}

export default { authenticateUser, authorizePermissions }
