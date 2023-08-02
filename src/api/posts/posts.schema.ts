import * as z from 'zod'

const PostSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Post title cannot be empty"
        }).min(1).max(100, "Title must be at most 100 characters"),
        content: z.string({
            required_error: "Post content must be provided"
        }),
        published: z.boolean().optional(),
        coverImageSource: z.string()
    })
})

const PartialPostSchema = PostSchema.partial()

type PostSchema = z.infer<typeof PostSchema>

export { PostSchema, PartialPostSchema as PostUpdateSchema }