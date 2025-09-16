import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

// Кастомный формат логов
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Создаем логгер только для консоли
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        colorize(), // Добавляем цвета
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ],
});

if (process.env.NODE_ENV === 'production') {
    logger.format = combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    );
}