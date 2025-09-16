import { appDataSource } from "../config/database";
import { Order } from "../models/Order";

export const apiService = {

    async createOrder(userId: number, orderData: {
        title: string;
        description: string;
        amount: number;
    }) {
        const orderRepository = appDataSource.getRepository(Order);

        const order = orderRepository.create({
            ...orderData,
            user: { id: userId },
            status: 'pending'
        });

        await orderRepository.save(order);
        return order;
    },

    async getUserOrders(userId: number) {
        const orderRepository = appDataSource.getRepository(Order);

        const orders = await orderRepository.find({
            where: { user: { id: userId } },
            relations: ["user"]
        });

        return orders.map(order => ({
            id: order.id,
            title: order.title,
            description: order.description,
            amount: order.amount,
            status: order.status,
            createdAt: order.createdAt
        }));

    }
};