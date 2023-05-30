import mongoose from 'mongoose';


const CommentSchema = new mongoose.Schema({
    comment: { type: String, required: true, minLength: 1, maxLength: 200 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    likeCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })


export const CommentModel = mongoose.model('Comment', CommentSchema);

