import type { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user
    if (!user) {
        res.status(403)
        return res.json({message: "Please Login to Continue"})
    }
    return next()

}

export default requireUser