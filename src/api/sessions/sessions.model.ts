import mongoose, { Document } from 'mongoose'
import { UserDocument } from '../users/users.model';
import bcrypt from 'bcrypt'

export interface SchemaDocument extends Document {
    user: UserDocument['_id'];
    valid: boolean,
    userAgent: string,
    createdAt: Date,
    updatedAt: Date
}

const SessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String }

}, { timestamps: true })




const SessionModel = mongoose.model("Session", SessionSchema)

export default SessionModel