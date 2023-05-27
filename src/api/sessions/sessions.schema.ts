import { z, string } from 'zod'

const SessionSchema = z.object({
    body: z.object({
        email: string({
            required_error: "Email is required"
        }).email("Invalid Email Address"),
        password: string({
            required_error: "Password is required"
        }).min(6, "Password too short - Minimum 6 characters"),
    })
})

type SessionSchema = z.infer<typeof SessionSchema>

export default SessionSchema
