import * as z from 'zod'
import Universal from '../../interfaces/UniversalModel'


const User = Universal.merge(z.object({
    username: z.string().min(1).max(15),
    password: z.string().min(8),
}))

type User = z.infer<typeof User>


export default User