import { Router } from 'express';
import { apiService } from '../services/api.service';
import { checkToken } from '../middleware/auth';
import rateLimit from "express-rate-limit";
import {sanitizeInput} from "../middleware/validation";

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10, // 100 запросов на IP
    message: { error: 'Too many API requests, please try again later' },
});

const router = Router();


router.use(apiLimiter);
router.use(checkToken);

router.get('/orders', async (req: any, res, next) => {
    try {
        const orders = await apiService.getUserOrders(req.user.userId);
        res.json({
            message: "Orders retrieved successfully",
            orders,
            count: orders.length
        });
    } catch (error) {
        next(error);
    }
});

router.post('/orders', async (req: any, res, next) => {
    try {
        const { title, description, amount } = req.body;

        if (!title || !description || !amount) {
            return res.status(400).json({
                error: 'Title, description and amount are required'
            });
        }

        const order = await apiService.createOrder(req.user.userId, {
            title,
            description,
            amount: parseFloat(amount)
        });

        res.status(201).json({
            message: "Order created successfully",
            order
        });
    } catch (error) {
        next(error);
    }
});

export default router;