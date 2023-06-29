import * as z from 'zod'

const PostSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Post title cannot be empty"
        }).min(1).max(100, "Title must be at most 100 characters"),
        content: z.string({
            required_error: "Post content cannot be empty"
        }).min(1).max(1000, "Content must be at most 1000 characters")
    })
})

const PostSchemaWithId = PostSchema.extend({
  body: PostSchema.shape.body.extend({
    id: z.string(),
  }),
});


type PostSchemaWithId = z.infer<typeof PostSchemaWithId>
type PostSchema = z.infer<typeof PostSchema>

export { PostSchema, PostSchemaWithId }