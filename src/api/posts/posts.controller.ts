import { Request, Response, NextFunction } from 'express'
import { getAllPosts, createPost, getSinglePost } from './posts.service'


export async function getAllPostsController(req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await getAllPosts()
        res.json(posts)
    } catch (error: any) {
        console.log(error.message)
        next(error)
    }
}

export async function createPostController(req: Request, res: Response, next: NextFunction) {
    let user = res.locals.user
    try {
        const post = await createPost({ author: user._id, title: req.body.title, content: req.body.content })
        res.send(post)
    } catch (error: any) {
        console.log(error.message)
        next(error)

    }
}

export async function getPostCommentsController(req: Request, res: Response) {
    const postId = req.params.postId
    if (!postId) res.sendStatus(404)
    const post = await getSinglePost(postId)
    res.send(post?.comments)
}
