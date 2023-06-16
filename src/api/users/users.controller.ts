import { NextFunction, Request, Response } from "express";
import { log } from "../../utils/logger";
import { createUser, getUsers } from "./users.service";
import UserSchema from "./users.schema";
import { omit } from 'lodash'
require('dotenv').config()

export async function createUserController(req: Request<{}, {}, UserSchema>, res: Response, next: NextFunction) {
    try {
        const user = await createUser(req.body)
        res.json(omit(user, ['password', 'createdAt', 'updatedAt']))
    } catch (e) {
        log.error(e);
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