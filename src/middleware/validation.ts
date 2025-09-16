import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import escapeHtml from 'escape-html';


export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = escapeHtml(req.body[key]);
            }
        }
    }
    next();
};

export const validateRegistration = [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores and hyphens'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),

    handleValidationErrors
];

export const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

export const validateOrder = [
    body('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),

    body('description')
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1 and 500 characters'),

    body('amount')
        .isFloat({ min: 0.01, max: 999999.99 })
        .withMessage('Amount must be a positive number less than 999999.99'),

    handleValidationErrors
];