
import UserModel, { UserDocument } from './users.model';
import { omit } from 'lodash'
import { FilterQuery } from 'mongoose';

export async function createUser(input: unknown) {
    try {
        const user = await UserModel.create(input)
        return omit(user.toJSON(), ['password'])
    } catch (error: any) {
        throw new Error(error)
    }
}

export async function getUsers() {
    try {
        return await UserModel.find({})
    } catch (error: any) {
        throw new Error(error)
    }
}


export async function validatePassword(email: string, password: string) {
    const user = await UserModel.findOne({ email })
    if (!user) {
        return false
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return false
    return omit(user.toJSON(), ['password'])
}

export async function findUser(query: FilterQuery<UserDocument>) {
    return await UserModel.find(query)
}

export async function patchUser(userId: string) {
    await UserModel.findByIdAndUpdate(userId, { role: "Admin" })
    
}