import { z } from 'zod'
import { v4 as uuidV4 } from 'uuid'

const Universal = z.object({
    id: z.string().uuid().default(() => uuidV4()),
    createdAt: z.date().default(() => new Date())
})

type Universal = z.infer<typeof Universal>

export default Universal