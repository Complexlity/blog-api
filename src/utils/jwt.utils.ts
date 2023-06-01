import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { omit } from 'lodash';

export interface decodedSchema {
    email: string;
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    session: string

}

const SECRET_KEY = process.env.PRIVATE_KEY as Secret

export function signJwt(payload: JwtPayload, options?: jwt.SignOptions | undefined) {
    return jwt.sign(payload, SECRET_KEY, { ...options || '' });
}

export function verifyJwt(token: string) {
    try {
        let decoded = jwt.verify(token, SECRET_KEY) as Partial<decodedSchema>
        //@ts-ignore
        if (decoded.hasOwnProperty('_doc')) decoded = decoded._doc
        return {
            valid: true,
            expired: false,
            decoded: omit(decoded, ['password', 'createdAt', 'updatedAt'
            ])
        }
    } catch (error: any) {
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null

        }
    }
}
