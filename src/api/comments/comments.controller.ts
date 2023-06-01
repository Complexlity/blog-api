import { NextFunction, Request, Response } from "express"
import { createComment, getComments, deleteComment, updateLike } from './comments.service'

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

export async function deleteCommentController(req: Request, res: Response, next: NextFunction) {
    let error
    let user = res.locals.user._id

    // Find Comment
    const commentId = req.params.commentId
    let comments = await getComments({ _id: commentId })
    if (!comments) {
        error = new Error("Comment not found")
        next(error)
    }

    // Check if user is the owner of the comment
    let comment = comments[0]
    if (comment.user.toString() !== user.toString()) {

        error = new Error("You are not the owner of this comment")
        error.cause = {
            commentUser: comment.user,
            deleter: user
        }

        return next(error)
    }


    // Process transaction to delete the comment
    try {
        await deleteComment(comment._id)
        res.status(200).send({ status: 200, message: "Comment Deleted Successfully" })
    } catch (error) {
        return next(error)
    }
}

export async function updateLikeController(req: Request, res: Response, next: NextFunction) {
    const userId = res.locals.user._id
    const commentId = req.params.commentId
    try {
        let comment = await updateLike(userId, commentId)
        res.status(200).send(comment)
    }
    catch (error) {
        next(error)
    }

}