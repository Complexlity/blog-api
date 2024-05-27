import { Request, Response, NextFunction } from 'express'
import { getAllPosts, createPost, getSinglePost, updateLike, deletePost, updatePost } from './posts.service'
import slugify from 'slugify'
import {customAlphabet} from 'nanoid'
import { floor } from 'lodash'
import fs from 'fs/promises'
import { UTApi } from 'uploadthing/server'
import { buffer } from 'stream/consumers'

const utapi = new UTApi();
function validateFile(file: any) {
    if (!file) {
        throw new Error("File not found")
    }
    
    return file
}

interface FileEsque extends Blob {
    name: string;
    customId?: string;
}

const bufferToArrayBuffer = (buffer: Buffer) => {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return arrayBuffer;
  };

export async function createPostController(req: Request, res: Response, next: NextFunction) {
    let user = res.locals.user
    let title = req.body.title
    const slug = slugify(title, {
        lower: true,
        strict: true
    })
    const type = req.body.type
    console.log({ type })
    if (type === "markdown") {
        const file = req.file as Express.Multer.File
        console.log({ file: req.file })
        console.log("I am here")
        // const file = validateFile(req.file)       
        await fs.writeFile('file.json', JSON.stringify(file))
        const fileBuffer = await fs.readFile(file.path)
        const arrayBuffer = bufferToArrayBuffer(fileBuffer)
        console.log({ fileBuffer })
        const fileEsque = {
            name: file.filename,
            type: file.mimetype,
            size: file.size,
            arrayBuffer: arrayBuffer
        } satisfies FileEsque
        const response1 = await utapi.uploadFiles
            //@ts-expect-error
            (fileBuffer).catch(err => {
                console.log("Buffer Error", err)
            console.log('Buffer failed')
        })
        const response2 = await utapi.uploadFilesFromUrl(file.path).catch(err => {
            console.log("Path Error", err)
            console.log('File path failed')
        })
    } 
    try {
        throw new Error("Successful")
        const post = await createPost({ author: user._id, title, slug, content: req.body.content, published: req.body.published ?? false, coverImageSource: req.body.coverImageSource, category: req.body.category })
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
    const slug = req.params.slug
    try {
        if (!slug) {
            res.status(400)
            throw new Error("PostID is required")
        }
        const post = await getSinglePost(slug)
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