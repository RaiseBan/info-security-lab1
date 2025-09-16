import {BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from "bcrypt";
import {Order} from "./Order";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
    async validatePassword(password: string): Promise<any> {
        return bcrypt.compare(password, this.password);
    }

}