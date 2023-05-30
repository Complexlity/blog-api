import { Request, Response } from 'express'

export function defaultRouter(req: Request, res: Response) {
    res.send('Hello World!')
}