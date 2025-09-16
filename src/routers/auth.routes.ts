import {NextFunction, Router, Request, Response} from "express";
import {authService} from "../services/auth.service";
import rateLimit from "express-rate-limit";
import {validateLogin, validateRegistration} from "../middleware/validation";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    limit: 5, // максимум 5 попыток на IP
    message: {
        error: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});


const router = Router();

router.use(authLimiter);

router.post("/login", ...validateLogin, async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.json(result)
    }catch (e: any) {
        res.status(401).json({ message: e.message});
    }


});

router.post('/register', ...validateRegistration, async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.register(username, password);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

