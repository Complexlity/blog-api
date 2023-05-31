import { NextFunction, Request, Response } from "express"
import { createComment } from './comments.service'

export async function createCommentController(req: Request, res: Response, next: NextFunction) {
    const userId = res.locals.user._id
    const postId = req.params.postId
    try {
        await createComment(userId, postId, req.body.comment)
        res.status(201).send({ status: 201, message: "Comment Created Successfully" })

    } catch (error: any) {
        next(error)
    }
}

