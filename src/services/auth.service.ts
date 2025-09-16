import {appDataSource} from "../config/database";
import {User} from "../models/User";
import {generateToken} from "../utils/jwt";

export const authService = {
    async login(username: string, password: string) {
        if (!username || !password) {
            throw new Error("Username and password are required");
        }
        const userRepo = appDataSource.getRepository(User);
        const user: User | null = await userRepo.findOne({
            where: {username: username}
        })
        if (!user || !(await user.validatePassword(password))) {
            throw new Error("Invalid credentials");
        }

        const token = generateToken({
            userId: user.id,
            username: user.username
        })
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
            }
        }

    },
    async register(username: string, password: string) {
        const userRepository = appDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where: {username: username}
        })
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = userRepository.create({username: username, password: password});
        await userRepository.save(user);

        return {
            message: "User created successfully",
        }
    }
}