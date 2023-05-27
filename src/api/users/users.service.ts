
import UserModel from './users.model';
import UserSchema from './users.schema'

export async function createUser(input: unknown) {
    try {
        return await UserModel.create(input)
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