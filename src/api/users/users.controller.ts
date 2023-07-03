import { NextFunction, Request, Response } from "express";
import { log } from "../../utils/logger";
import { createUser, getUsers, patchUser } from "./users.service";
import UserSchema from "./users.schema";
import { omit } from 'lodash'
import getErrorMessage from '../../utils/getErrorMessage'
import { UserDocument } from "./users.model";
require('dotenv').config()

export async function createUserController(req: Request<{}, {}, UserSchema>, res: Response, next: NextFunction) {
    try {
        const user = await createUser(req.body)
        res.json(omit(user, ['password', 'createdAt', 'updatedAt']))
    } catch (e:any) {
        e = getErrorMessage(e)
        res.status(409)
        next(e)
    }
}

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        let users = await getUsers()
        users = users.map(user => omit(user.toJSON(), ['password'])) as Omit<typeof users, 'password'>
        res.json(users)
    } catch (error) {
        res.status(500)
        next(error)

    }
}


export async function patchUserController(req: Request, res: Response, next: NextFunction) {
    const user: Partial<UserDocument> = res.locals.user
    if (user.role === "Admin") {
        res.status(409).json({ message: "Already An Admin" , user})
        return
    }
    const adminSecretKey = req.body.adminSecretKey;
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY
    if (adminSecretKey !== ADMIN_SECRET_KEY) {
        return res.status(401).json({message: "Invalid Secret Key"})
    }
    try {
        await patchUser(user._id)
        return res.json({message: "Successfully Changed Status", user: {...user, role: "Admin"}})
    } catch (error) {
        next(error)
    }

}