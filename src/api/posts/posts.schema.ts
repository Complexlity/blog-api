import * as z from 'zod'

const PostSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Post title cannot be empty"
        }).min(1).max(30, "Title must be at most 30 characters"),
        content: z.string({
            required_error: "Post content cannot be empty"
        }).min(1).max(1000, "Content must be at most 1000 characters")
    })
})

type PostSchema = z.infer<typeof PostSchema>

export { PostSchema }