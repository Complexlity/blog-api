import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface UserDocument extends Document {
    email: string;
    name: string;
    password: string;
    role: "Admin" | "Member";
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "Member"}

}, { timestamps: true })

UserSchema.pre('save', async function (next) {
    let user = this as UserDocument

    if (!user.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hashSync(user.password, salt)

    user.password = hash
    return next()
})

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as UserDocument
    return await bcrypt.compare(candidatePassword, user.password).catch(e => false)
}

UserSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
    }
});


const UserModel = mongoose.model<UserDocument>("User", UserSchema)

export default UserModel