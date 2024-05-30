import * as z from 'zod'

const PostSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Post title cannot be empty"
        }).min(1).max(100, "Title must be at most 100 characters"),
        content: z.string({
            required_error: "Post content must be provided"
        }),

        published: z.preprocess((value) => {
            if (value === undefined || value === null) return undefined;
            if (value === 'true') return true;
            if (value === 'false') return false
            return true;
          }, z.boolean().optional()),
        coverImageSource: z.string({
            required_error: "Cover Image not found"
        }),
        category: z.string({
            required_error: "Category Missing"
        }),
        type: z.union([z.literal('plain'), z.literal("raw")])
    })
})

const PartialPostSchema = PostSchema.partial()

type PostSchema = z.infer<typeof PostSchema>

export { PostSchema, PartialPostSchema as PostUpdateSchema }