import type { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const user = res.locals.user
    // console.log("I am here now and user is " + user)

    if (!user) {
        return res.sendStatus(403)
    }
    return next()

}

export default requireUser