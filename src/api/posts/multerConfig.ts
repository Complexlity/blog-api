import multer from 'multer'
import { NextFunction, Request, Response } from 'express';
import path from 'path'
import fs from 'fs'
import { customAlphabet } from 'nanoid';
import { UTApi } from "uploadthing/server";
 

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 7)
// Define a storage configuration with custom naming and file type validation
const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, 'uploads/'); // Adjust the path as needed
    },
    filename: (req, file, cb) => {
        const randomString = nanoid()
        const originalFileName = path.parse(file.originalname).name
      const customFileName = `${originalFileName}_${randomString}.md`
      cb(null, customFileName);
    },
  });
  
  const fileFilter = (req: Request, file: any, cb: (...args: any[]) => any) => {
    if (path.extname(file.originalname) !== '.md') {
      return cb(new Error('Invalid file type, only markdown files are allowed!'), false);
    }
    cb(null, true);
  };
  
  const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
  });
  
  // Error handling middleware for multer
  const handleMulterErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError || err.message === 'Invalid file type, only markdown files are allowed!') {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
        });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  };

  export {upload, handleMulterErrors}