import type { NextFunction, Request, Response } from "express"
import { get, omit } from 'lodash'
import { verifyJwt } from "../utils/jwt.utils"
import { reIssueAccessToken } from "../api/sessions/sessions.service"


export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "cookies.access-token") || get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')
    const refreshToken = get(req, "cookies.refresh-token") || get(req, 'headers.x-refresh') as (string | undefined)

    if (!accessToken) return next()
    const { decoded, expired } = verifyJwt(accessToken)
    if (decoded) {
        res.locals.user = decoded
        return next()
    }

    if (expired && refreshToken) {
        const result = await reIssueAccessToken(refreshToken)
        let user, newAccessToken
        if (result) {
            user = result.user
            newAccessToken = result.newAccessToken
            res.setHeader('x-access-token', newAccessToken)
            res.locals.user = user
        }
        res.cookie('access-token', newAccessToken, {
            maxAge: 900000, // 15 mins
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        })
        return next()
    }

    return next()
}
