import { FilterQuery } from "mongoose";
import { PostModel, PostDocument } from "./posts.model";
import { CommentModel } from "../comments/comments.model";

export async function getAllPosts(query: FilterQuery<PostDocument> = {}) {
    return await PostModel.find(query).sort({ createdAt: -1 }).populate({
        path: 'author',
        select: 'name'
    }).populate({
        path: 'comments',
        select: "comment user likeCount likes",
        populate: {
            path: 'user',
            select: 'name'
        }
    })
}
export async function getSinglePost(postId: string) {
    const post = await PostModel.findById(postId).populate({
        path: 'comments',
        select: "comment user likeCount likes createdAt",
        populate: {
            path: 'user',
            select: 'name'
        }
    })
    return post
}

export async function createPost(query: FilterQuery<PostDocument>) {
    let post = (await PostModel.create(query)).populate('author')
    return post
}

export async function updateLike(userId: string, postId: string) {
    const post = await PostModel.findById(postId);
    if (!post) throw new Error("Post Not Found");
    const userIndex = post.likes.indexOf(userId);
    if (userIndex === -1) {
        // User hasn't liked the post yet
        post.likeCount++
        post.likes.push(userId);
    } else {
        // User already liked the post
        post.likeCount--;
        post.likes.splice(userIndex, 1);
    }

    await post.save();
    return post
}

export async function deletePost(postId: string) {
    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        const deletedPost = await PostModel.findById(postId, null, { session });
        if (!deletedPost) throw new Error('Post not found');

        const commentIds = deletedPost.comments;
        return deletedPost;
        await CommentModel.deleteMany({ _id: { $in: commentIds } }, { session });
        await PostModel.findByIdAndDelete(postId, { session });

        await session.commitTransaction();
        return deletedPost;
    } catch (error: any) {
        await session.abortTransaction();
        throw new Error(error.message);
    } finally {
        await session.endSession();
    }
}
