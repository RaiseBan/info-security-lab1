import { DataSource } from "typeorm";
import { User } from "../models/User";
import dotenv from "dotenv";
dotenv.config({quiet: true});

export const appDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "secure_api_db",
    entities: [User],
    synchronize: true, // dev
    logging: false,
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});