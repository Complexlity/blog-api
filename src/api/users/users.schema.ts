import { z, string } from 'zod'

const UserSchema = z.object({
    body: z.object({
        name: string({
            required_error: "Name is required"
        }),
        password: string({
            required_error: "Password is required"
        }).min(6, "Password too short - Minimum 6 characters"),
        passwordConfirmation: string({
            required_error: "Password Confirmation is required"
        }),
        email: string({ required_error: "Email is Required" }).email("Invalid email address provided"),
    }).transform(function (body) {
        if (body.password !== body.passwordConfirmation) {
            throw new Error("Passwords do not match")
        }
        return { name: body.name, email: body.email, password: body.password }
    })
})

type UserSchema = z.infer<typeof UserSchema>

export default UserSchema
