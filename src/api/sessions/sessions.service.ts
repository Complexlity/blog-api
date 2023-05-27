import SessionModel from "./sessions.model";

export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent })
    return session.toJSON()
}

export async function getSessions() {
    const sessions = await SessionModel.find({})
    return sessions
}