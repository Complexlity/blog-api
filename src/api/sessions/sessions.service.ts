import SessionModel, { SessionDocument } from "./sessions.model";
import { FilterQuery, UpdateQuery } from "mongoose";

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