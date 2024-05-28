import mongoose from "mongoose";
import { UserDocument } from "../users/users.model";
import { CommentDocument } from "../comments/comments.model";

export interface PostDocument extends mongoose.Document {
    title: string
    slug: string
    content: any
  author: UserDocument['_id']
  type: "plain" | "raw",
    published: boolean
    coverImageSource: string
    category: string
    comments: CommentDocument['_id'][]
    likes: UserDocument['_id'][]
    likeCount: number
    createdAt: Date
    updatedAt: Date
}


const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 100 },
    slug: { type: String, required: true, minLength: 1, maxLength: 100 },
    content: { type: String, required: true, minLength:10,  },
    type: {
      type: String,
      enum: ['plain', 'raw'],
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    published: { type: Boolean, default: false },
    coverImageSource: { type: String },
    category: { type: String },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


const PostModel = mongoose.model<PostDocument>("Post", PostSchema)

export { PostModel }