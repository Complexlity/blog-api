import { NextFunction, Request, Response } from "express";
import { validatePassword } from "../users/users.service";
import { createSession, getAllSessions, getSessions, updateSession } from "./sessions.service";
import { signJwt } from "../../utils/jwt.utils";

const { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } = process.env

export async function createSessionController(req: Request, res: Response, next: NextFunction) {
    // Validate user password
    let { email, password } = req.body
    const user = await validatePassword(email, password)

    if (!user) {
        //@ts-ignore
        return res.status(401).json({ message: "Invalid credentials" })
    }

    // Create a session
    //@ts-ignore
    const session = await createSession(user._id, req.get('user-agent') || "")
    // Create an access token

    const accessToken = signJwt({
        ...user, session: session._id
    }, { expiresIn: ACCESS_TOKEN_TTL })


    // Create a refresh token
    const refreshToken = signJwt({ ...user, session: session._id, }
        , { expiresIn: REFRESH_TOKEN_TTL })
    // return access and refresh token
    return res.send({ accessToken, refreshToken })
}

export async function getUserSessionsController(req: Request, res: Response) {
    const userId = res.locals.user._id
    console.log(res.locals.user)
    console.log(userId)

    const sessions = await getSessions({ user: userId, valid: false })
    return res.send(sessions)
}

export async function deleteSessionsController(req: Request, res: Response) {
    const sessionId = res.locals.user.sessionId

    await updateSession({ _id: sessionId, }, { valid: false })
    res.send({ accessToken: null, refreshToken: null })
}

export async function getAllSessionsControlller(req: Request, res: Response) {
    const sessions = await getAllSessions()
    return res.send(sessions)
}