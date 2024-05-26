import type { Request, Response, NextFunction } from "express";
import multer from 'multer'
const upload = multer({ dest: 'uploads/' }); // Set the directory for file uploads


const parseWithMulter = (req: Request, res: Response, next: NextFunction) => {
    return upload.single('file')   
}

export default parseWithMulter