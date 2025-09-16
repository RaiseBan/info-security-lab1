import {NextFunction, Request, Response} from "express";
import {verifyToken} from "../utils/jwt";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Access denied'})
    }

    try {
        (req as any).user = verifyToken(token);
        next();
    }catch (e: any) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}