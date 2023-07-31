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
        imageSrc: string({required_error: "No image source specified"})
    }).transform(function (body) {
        if (body.password !== body.passwordConfirmation) {
            throw new Error("Passwords do not match")
        }
        return { name: body.name, email: body.email, password: body.password, imageSrc: body.imageSrc }
    })
})

type UserSchema = z.infer<typeof UserSchema>

const UserPatchSchema = z.object({
    body: z.object({
        adminSecretKey: z.string({
            required_error: "Admin Key is Required"
        }
        )
    })
})

type UserPatchSchema = z.infer<typeof UserPatchSchema>
export { UserPatchSchema }

export default UserSchema
