import { CommentDocument, CommentModel } from "./comments.model";
import { PostModel } from "../posts/posts.model";
import mongoose, { FilterQuery } from "mongoose";

export async function getComments(query: FilterQuery<CommentDocument>) {
    let comments = await CommentModel.find(query).sort({ createdAt: -1 })
    return comments
}

export async function createComment(userId: string, postId: string, comment: string) {
    let session = await mongoose.startSession()
    session.startTransaction()
    try {
        let newComment = await CommentModel.create([{ user: userId, post: postId, comment }], { session }) as Partial<CommentDocument>[]

        const post = await PostModel.findById(postId, null, { session })
        //@ts-ignore
        post?.comments.push(newComment[0]._id)
        await post?.save({ session })
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

export async function deleteComment(commentId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const deletedComment = await CommentModel.findByIdAndDelete(commentId, { session });
        //@ts-ignore
        const postId = deletedComment.post;
        const post = await PostModel.findById(postId, null, { session });
        //@ts-ignore
        post.comments = post.comments.filter((comment: string) => comment !== commentId);
        await post?.save({ session });
        await session.commitTransaction();
    } catch (error: any) {
        await session.abortTransaction();
        throw new Error(error.message);
    } finally {
        await session.endSession();
    }
}

export async function updateLike(userId: string, commentId: string) {
    const comment = await CommentModel.findById(commentId) as unknown as CommentDocument
    console.log({ comment, userId, commentId })
    if (!comment) throw new Error("Comment Not Found");
    const userIndex = comment.likes.indexOf(userId);
    if (userIndex === -1) {
        // User hasn't liked the comment yet
        comment.likeCount++;
        comment.likes.push(userId);
    } else {
        // User already liked the comment
        comment.likeCount--;
        comment.likes.splice(userIndex, 1);
    }
    await comment.save();
}
