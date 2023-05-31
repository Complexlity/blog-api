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
