import mongoose, { FilterQuery } from 'mongoose';
import { CommentModel } from "../comments/comments.model";
import { PostDocument, PostModel } from "./posts.model";
import { UserDocument } from "../users/users.model";

export async function getAllPosts(query: FilterQuery<PostDocument> = {}) {
    return await PostModel.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "name",
      })
      .populate({
        path: "comments",
        select: "comment user likeCount likes createdAt",
        populate: {
          path: "user",
          select: "name",
        },
      });
}
export async function getSinglePost(postId: string) {
    const post = await PostModel.findById(postId).populate({
        path: 'author',
        select: 'name'
    }).populate({
        path: 'comments',
        select: "comment user likeCount likes createdAt",
        populate: {
            path: 'user',
            select: 'name'
        }
    })
    if (!post) {
      let error = new Error("Post Not Found");
      error.cause = 404;
      throw error;
    }
    return post
}

export async function createPost(query: FilterQuery<PostDocument>) {
    let post = (await PostModel.create(query)).populate('author')
    return post
}

export async function updatePost(query: FilterQuery<PostDocument>, user: UserDocument) {
    const userId = user._id
    let userRole = user.role
    const post = await getSinglePost(query.id)
    if (post.author._id.toString() !== userId && userRole !== "Admin") {
        let error = new Error("You are not authorized to update this post");
        error.cause = 403;
        throw error;
    }
post.title = query.title ?? post.title;
post.content = query.content ?? post.content;
post.published = query.published ?? post.published;

    await post.save()
  return post;
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

export async function deletePost(postId: string, user: UserDocument) {
    const userId = user._id
    const userRole = user.role
    if (!postId) {
        let error = new Error("Post Value is Missing from Request");
        error.cause = 404
        throw error
    }

    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        const deletedPost = await PostModel.findById(postId, null, { session });
        if (!deletedPost) {
        let error = new Error("Post Value is Missing from Request");
            error.cause = 404
            throw error
        }
        if (deletedPost.author !== userId && userRole !== "Admin") {
        let error = new Error("You are not authorized to delete this post");
        error.cause = 401
        throw error;
        }
        const commentIds = deletedPost.comments;
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
