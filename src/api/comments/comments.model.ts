import mongoose from 'mongoose';

export interface CommentDocument extends mongoose.Document {
    comment: string
    user: string
    post: string
    likes: string[]
    likeCount: number
    createdAt: Date
    updatedAt: Date
}



const CommentSchema = new mongoose.Schema({
    comment: { type: String, required: true, minLength: 1, maxLength: 200 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    likeCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })


export const CommentModel = mongoose.model<CommentDocument>('Comment', CommentSchema);

