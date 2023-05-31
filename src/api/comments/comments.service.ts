import { CommentDocument, CommentModel } from "./comments.model";
import { PostModel } from "../posts/posts.model";
import mongoose from "mongoose";


export async function createComment(user: string, post: string, comment: string) {
    let session = await mongoose.startSession()
    session.startTransaction()
    try {
        let newComment = await CommentModel.create([{ user, post, comment }], { session }) as Partial<CommentDocument>[]
        const posted = await PostModel.findOne({ _id: post })
        posted?.comments.push(newComment[0]._id)
        await posted?.save()
        await session.commitTransaction()
    }
    //@ts-ignore
    catch (error: any) {
        await session.abortTransaction()
        throw new Error(error.message)
    }
    finally {
        await session.endSession()
    }
}