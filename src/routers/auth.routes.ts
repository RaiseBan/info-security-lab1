import {NextFunction, Router, Request, Response} from "express";
import {authService} from "../services/auth.service";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.json(result)
    }catch (e: any) {
        res.status(401).json({ message: e.message});
    }


});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.register(username, password);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

