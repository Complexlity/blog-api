import { Request, Response, NextFunction } from 'express'
import { getAllPosts, createPost, getSinglePost, updateLike, deletePost, updatePost } from './posts.service'


export async function createPostController(req: Request, res: Response, next: NextFunction) {
    let user = res.locals.user
    try {
        const post = await createPost({ author: user._id, title: req.body.title, content: req.body.content })
        res.send(post)
    } catch (error: any) {
        next(error)

    }
}

export async function updatePostController(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;
    let user = res.locals.user
    const published = req.body.published
    try {
        const post = await updatePost({ id: postId, title: req.body.title, content: req.body.content, published }, user)
        res.send(post)
    } catch (error: any) {
        res.statusCode = error.cause
        next(error)

    }
}

export async function getAllPostsController(req: Request, res: Response, next: NextFunction) {
    let published;
    switch (req.query.published) {
      case "true":
        published = true;
        break;
      case "false":
        published = false;
        break;
      default:
        published = undefined;
        break;
    }

    try {
        const posts = await getAllPosts(published === undefined ? {} : {published});

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
        let deletedPost = await deletePost(postId, user)
        res.send(deletedPost)
    } catch (error: any) {
        if (error.cause === 401 || error.cause === 404) {
            res.status = error.cause
        }
        next(error)
    }
}