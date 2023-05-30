import { Request, Response } from "express"

export function defaultComment(req: Request, res: Response) {
    res.send("I am a default comment")
} 