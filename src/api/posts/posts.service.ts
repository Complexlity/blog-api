import { FilterQuery } from "mongoose";
import { PostModel, PostDocument } from "./posts.model";
import { omit } from 'lodash'

export async function getPosts(query: FilterQuery<PostDocument> = {}) {
    return await PostModel.find(query).sort({ createdAt: -1 }).populate('author')
}

export async function createPost(query: FilterQuery<PostDocument>) {
    let post = (await PostModel.create(query)).populate('author')
    return post
}

export async function getComments(postId: string) {
    return await PostModel.findById(postId).populate('comments')
}