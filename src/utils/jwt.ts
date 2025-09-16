import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || '9f72a877f7a367dad1619cb26641e1cf';

export interface JwtPayload {
    userId: number;
    username: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h',
    });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}