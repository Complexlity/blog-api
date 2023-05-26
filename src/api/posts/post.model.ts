import * as z from 'zod'
import Universal from '../../interfaces/UniversalModel'
import Comment from '../comments/comment.model'


const Post = Universal.merge(z.object({
    title: z.string().min(1).max(15),
    content: z.string().min(1).max(2000),
    comments: z.array(z.string().uuid())
}))

type Post = z.infer<typeof Post>


export default Post