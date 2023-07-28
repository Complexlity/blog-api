import { CommentDocument, CommentModel } from "./comments.model";
import { PostModel } from "../posts/posts.model";
import mongoose, { FilterQuery } from "mongoose";

export async function getComments(query: FilterQuery<CommentDocument>) {
    let comments = await CommentModel.find(query).sort({ createdAt: -1 })
    return comments
}

export async function createComment(userId: string, postId: string, comment: string) {
    // let session = await mongoose.startSession({
    //   defaultTransactionOptions: { writeConcern: { w: "majority" } },
    // });
    // session.startTransaction()
    let newComment
    try {
        const post = await PostModel.findById(postId, null)
        if (!post) {
            throw new Error('Post Not Found')
        }

        newComment = await CommentModel.create([{ user: userId, post: postId, comment }]) as Partial<CommentDocument>[]
       newComment = await CommentModel.populate(newComment, { path: "user", select: "name" });

        //@ts-ignore
        post.comments.push(newComment[0]._id)
        await post.save()


    }
    //@ts-ignore
    catch (error: any) {
        throw new Error(error.message)
    }

    return newComment[0]
}

export async function deleteComment(commentId: string) {

    try {
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);
        //@ts-ignore
        const postId = deletedComment.post;
        const post = await PostModel.findById(postId, null);
        //@ts-ignore
        post.comments = post.comments.filter((comment: string) => comment !== commentId);
        await post?.save();

        return deletedComment;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function updateLike(userId: string, commentId: string) {
    const comment = await CommentModel.findById(commentId) as unknown as CommentDocument

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
    return comment
}
