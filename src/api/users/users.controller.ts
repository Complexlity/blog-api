import { NextFunction, Request, Response } from "express";
import { log } from "../../utils/logger";
import { createUser, getUsers } from "./users.service";
import UserSchema from "./users.schema";
import { omit } from 'lodash'


export async function createUserController(req: Request<{}, {}, UserSchema>, res: Response, next: NextFunction) {
    try {
        const user = await createUser(req.body)

        res.json(omit(user.toJSON(), ['password']))
    } catch (e) {
        log.error(e);
        next(e)
    }
}

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await getUsers()
        let omittedUsers = users.map(user => omit(user.toJSON(), ['password']))
        res.json(omittedUsers)
    } catch (error) {

    }
}