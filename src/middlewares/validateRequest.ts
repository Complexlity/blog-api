import type { Request, Response, NextFunction } from 'express'
import { AnyZodObject, z, } from 'zod'
import fs from 'fs'
type Schema = AnyZodObject | z.ZodEffects<any, any>

const validate = (schema: Schema) => function (req: Request, res: Response, next: NextFunction) {
    console.log({ body: req.body })
    // console.log({ file: req.file })
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        })
        next()
    } catch (e: any) {
        return res.status(422).send(formatErrors(e.errors));
    }
}


function formatErrors(errors: any) {
    const firstError = errors[0];
    const { code, path, message } = firstError;
    return { code, path: path.join('.'), message };
}

export default validate