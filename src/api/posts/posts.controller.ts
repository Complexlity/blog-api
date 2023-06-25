import { Request, Response, NextFunction } from 'express'
import { getAllPosts, createPost, getSinglePost, updateLike, deletePost } from './posts.service'


export async function createPostController(req: Request, res: Response, next: NextFunction) {
    let user = res.locals.user
    try {
        const post = await createPost({ author: user._id, title: req.body.title, content: req.body.content })
        res.send(post)
    } catch (error: any) {
        next(error)

    }
}
export async function getAllPostsController(req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await getAllPosts()
        res.json(posts)
    } catch (error: any) {
        next(error)
    }
}

export async function getSinglePostController(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId
    try {
        if (!postId) {
            res.status(400)
            throw new Error("PostID is required")
        }
        const post = await getSinglePost(postId)
        res.json(post)
    } catch (error: any) {
        next(error)
    }

}


export async function getPostCommentsController(req: Request, res: Response) {
    const postId = req.params.postId
    if (!postId) res.sendStatus(404)
    const post = await getSinglePost(postId)
    res.send(post?.comments)
}


export async function updateLikeController(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId
    const user = res.locals.user
    const userId = user._id
    try {
        if (!postId) {
            res.status(400)
            throw new Error("Post Not Found")
        }
        let post = await updateLike(userId, postId)
        res.status(200).json(post)
    } catch (error) {
        next(error)
    }
}

export async function deletePostController(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId
    const user = res.locals.user
    const userId = user._id
    const userRole = user.role
    try {

        if (!postId) {
            res.status(403)
            throw new Error("Post Value is Missing from Request")
        }
        if (postId !== userId && userRole !== 'Admin' ) {
            res.status(401)
            throw new Error("You are not authorized to delete this post")
        }
        let deletedPost = await deletePost(postId)
        res.sendStatus(200).json(deletedPost)
    } catch (error) {
        next(error)
    }
}