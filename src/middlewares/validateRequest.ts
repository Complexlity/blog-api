import type { Request, Response, NextFunction } from 'express'
import { AnyZodObject, z } from 'zod'

type Schema = AnyZodObject | z.ZodEffects<any, any>

const validate = (schema: Schema) => function (req: Request, res: Response, next: NextFunction) {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        })
        next()
    } catch (error) {
        next(error)
    }
}

export default validate