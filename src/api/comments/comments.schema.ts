import * as z from 'zod'

const CommentSchema = z.object({
    body: z.object({
        comment: z.string({
            required_error: "Post content cannot be empty"
        }).min(1).max(1000, "Content must be at most 1000 characters")
    }),
    params: z.object({
        postId: z.string({
            required_error: "Post id cannot be empty"
        })
    })
})

type CommentSchema = z.infer<typeof CommentSchema>

export { CommentSchema }