
import UserModel, { UserDocument } from './users.model';
import bcrypt from 'bcrypt'
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

    const isMatch = user.comparePassword(password)
    if (!isMatch) return false
    return omit(user.toJSON(), ['password'])
}

export async function findUser(query: FilterQuery<UserDocument>) {
    return await UserModel.find(query)
}