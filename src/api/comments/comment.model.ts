// import * as z from 'zod'
// import Universal from '../../interfaces/UniversalModel';
import { v4 as uuidV4 } from 'uuid'
import { z } from 'zod'

const Universal = z.object({
    id: z.string().uuid().default(() => uuidV4()),
    createdAt: z.date().default(() => new Date())
})

const Comment = Universal.merge(z.object({
    content: z.string().min(1).max(250),
    likeCount: z.number().int().default(0),
}))

type Comment = z.infer<typeof Comment>

export default Comment
