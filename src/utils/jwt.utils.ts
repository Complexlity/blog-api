import jwt, { Secret, JwtPayload } from 'jsonwebtoken'


const SECRET_KEY = process.env.PRIVATE_KEY as Secret



export function signJwt(payload: JwtPayload, options?: jwt.SignOptions | undefined) {
    return jwt.sign(payload, SECRET_KEY, { ...options || '' });
}

export function verifyJwt(token: string) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY)

        return {
            valid: true,
            expired: false,
            decoded
        }
    } catch (error: any) {
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null

        }
    }
}
