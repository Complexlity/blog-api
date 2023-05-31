import mongoose from "mongoose";

export interface PostDocument extends mongoose.Document {
    title: string
    content: string
    author: string
    published: boolean
    comments: string[]
    likes: string[]
    likeCount: number
    createdAt: Date
    updatedAt: Date
}


const PostSchema = new mongoose.Schema({
    title: { type: String, required: true, minLength: 1, maxLength: 30 },
    content: { type: String, required: true, minLength: 1, maxLength: 1000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    published: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0 }

}, { timestamps: true })


const PostModel = mongoose.model<PostDocument>("Post", PostSchema)

export { PostModel }