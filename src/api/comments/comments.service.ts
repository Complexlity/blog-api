import { CommentDocument, CommentModel } from "./comments.model";
import { PostModel } from "../posts/posts.model";
import mongoose from "mongoose";


export async function createComment(user: string, post: string, comment: string) {
    let session = await mongoose.startSession()
    try {
        let newComment = CommentModel.create([{ user, post, comment }], { session }) as Partial<CommentDocument>
        await PostModel.findByIdAndUpdate(post, { $push: { comments: newComment._id } })
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