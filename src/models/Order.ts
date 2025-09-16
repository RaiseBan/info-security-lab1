import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    status: string; // 'pending', 'completed', 'cancelled'

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.orders)
    user: User;
}