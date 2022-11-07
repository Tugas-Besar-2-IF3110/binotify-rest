import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;
    
    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @Column()
    name: string;
    
    @Column({ default: false })
    isAdmin: boolean;
}