import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import {appDataSource} from "./config/database";
import {logger} from "./utils/logger";

import 'reflect-metadata';
import authRoutes from "./routers/auth.routes";
import apiRoutes from "./routers/api.routes";
import {sanitizeInput} from "./middleware/validation";

dotenv.config({
    quiet: true,
});

const app = express();

async function main() {
    try {
        await appDataSource.initialize();
        logger.info("Database initialized successfully");
    } catch (error) {
        logger.error("Database initialization failed:", error);
        process.exit(1);
    }

    const PORT = process.env.PORT || 8080;

    app.use(helmet());
    app.use(cors());
    app.use(morgan('combined'));

    app.use(express.json({
        limit: "1mb"
    }));
    app.use(express.urlencoded({
        extended: true,
        limit: "1mb"
    }));

    // Middleware для обработки ошибок JSON парсинга (должен быть ПОСЛЕ express.json)
    app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (error instanceof SyntaxError && 'body' in error) {
            return res.status(400).json({
                error: 'Invalid JSON format',
                message: 'Request body contains invalid JSON'
            });
        }
        next(error);
    });

    app.use(sanitizeInput);

    app.use('/auth', authRoutes);
    app.use('/api', apiRoutes);

    app.get('/health', (req, res) => {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            message: 'Server is running',
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            error: 'Route not found',
            path: req.path
        });
    });

    app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        logger.error('Unhandled error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    });

    app.listen(PORT, () => {
        logger.info(`🚀 Server running on http://localhost:${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

main().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
});

export default app;