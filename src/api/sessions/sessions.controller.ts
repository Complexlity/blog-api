import { NextFunction, Request, Response } from "express";
import { validatePassword } from "../users/users.service";
import { createSession, getSessions } from "./sessions.service";
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

export async function getSessionsController(req: Request, res: Response) {
    const sessions = await getSessions()
    return res.send(sessions)
}