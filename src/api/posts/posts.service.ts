import { FilterQuery } from "mongoose";
import { PostModel, PostDocument } from "./posts.model";
import { omit } from 'lodash'

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
    console.log({ user: userId, post: postId })
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
