import SessionModel, { SessionDocument } from "./sessions.model";
import { FilterQuery, UpdateQuery } from "mongoose";
import { get } from 'lodash'
import { verifyJwt, signJwt } from "../../utils/jwt.utils";
import { findUser } from '../users/users.service'
import { omit } from 'lodash'


const { ACCESS_TOKEN_TTL } = process.env
export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent })
    return session.toJSON()
}

export async function getSessions(query: FilterQuery<SessionDocument>) {
    const sessions = await SessionModel.find(query)
    return sessions
}
export async function getAllSessions() {
    const sessions = await SessionModel.find({})
    return sessions
}


export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
    return SessionModel.updateOne(query, update)
}


export async function reIssueAccessToken(refreshToken: string) {
    const { decoded } = verifyJwt(refreshToken)

    if (!decoded || !get(decoded, '_id')) return false
    const session = await SessionModel.findById(decoded.session)

    if (!session || !session.valid) return false
    const users = await findUser({ _id: session.user })
    const user = users[0]
    if (!user) return false
    const newAccessToken = signJwt({
        ...user, session: session._id
    }, { expiresIn: ACCESS_TOKEN_TTL })

    return { user, newAccessToken }
}