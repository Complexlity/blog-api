import { Request, Response } from "express"
import { createComment } from './comments.service'

export function defaultComment(req: Request, res: Response) {
    res.send("I am a default comment")
}

export async function createCommentController(req: Request, res: Response) {
    const userId = res.locals.user._id
    const postId = req.params.postId
    await createComment(userId, postId, req.body.comment)
    res.status(201).send({ status: 201, message: "Comment Created Successfully" })
}

