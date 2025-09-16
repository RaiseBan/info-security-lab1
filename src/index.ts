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

dotenv.config({
    quiet: true,
});
const app = express()

async function main() {
    try {
        await appDataSource.initialize();
        logger.info("Initializing database...");
    }catch (error) {
        logger.error(error);
    }



    const PORT = process.env.PORT || 8080;

    app.use(helmet());
    app.use(cors());
    app.use(morgan('combined'));
    app.use(express.json({
        limit: "10mb",
    }));
    app.use(express.urlencoded({ extended: true }));


    app.use('/auth', authRoutes);
    app.use('/api', apiRoutes);


    app.get('/health', (req, res) => {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            message: 'Server is running',
        })
    })

    app.use((req, res) => {
        res.status(404).json({
            error: 'Route not found',
            path: req.path
        });
    });


    app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    });


    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

main();


export default app;