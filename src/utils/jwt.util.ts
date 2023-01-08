import jwt from 'jsonwebtoken'
import { tokenUserInterface } from '@/utils/creatTokenUser.util'
import { Response } from 'express'

interface refreshTokenUserInterface {
    user: tokenUserInterface
    refreshToken: string
}

const createJWT = ({ payload }: any): string => {
    return jwt.sign(payload, String(process.env.JWT_SECRET))
}

const isTokenValid = (token: string) => {
    return jwt.verify(token, String(process.env.JWT_SECRET))
}

const attachCookiesToResponse = ({
    res,
    tokenUser,
    refreshToken,
}: {
    res: Response
    tokenUser: tokenUserInterface
    refreshToken: string
}): void => {
    const accessTokenJWT = createJWT({ payload: { tokenUser } })
    const refreshTokenJWT = createJWT({
        payload: { user: tokenUser, refreshToken },
    })

    const oneDay = 1000 * 60 * 60 * 24
    const thirtyDay = oneDay * 30

    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production', //a boolean indicating whether the cookie is only to be sent over HTTPS
        signed: true,
        expires: new Date(Date.now() + oneDay),
    })
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        signed: true,
        expires: new Date(Date.now() + thirtyDay),
    })
}

export { createJWT, isTokenValid, attachCookiesToResponse }
