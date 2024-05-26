import * as z from 'zod'

const PostSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Post title cannot be empty"
        }).min(1).max(100, "Title must be at most 100 characters"),
        content: z.string({
            required_error: "Post content must be provided"
        }).optional(),
        published: z.preprocess((value) => {
            if (value === undefined || value === null) return undefined;
            if (value === 'true') return true;
            if (value === 'false') throw new Error("Published cannot be false");
            return true;
          }, z.boolean().optional()),
        coverImageSource: z.string(),
        category: z.string(),
        type: z.string()
    })
})

const PartialPostSchema = PostSchema.partial()

type PostSchema = z.infer<typeof PostSchema>

export { PostSchema, PartialPostSchema as PostUpdateSchema }