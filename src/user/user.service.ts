import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    createUser(user: any): Promise<any> {
        return this.userRepository.save(
          this.userRepository.create(user)
        );
    }

    findAllUser(): Promise<User[]> {
        return this.userRepository.find();
    }

    findUserByUsername(username: string): Promise<User> {
        return this.userRepository
        .createQueryBuilder()
        .where('username = :username', { username })
        .getOne();
    }

    findUserByEmail(email: string): Promise<User> {
        return this.userRepository
        .createQueryBuilder()
        .where('email = :email', { email })
        .getOne();
    }

    updateUser(id: string, user: any): Promise<any> {
        return this.userRepository
        .createQueryBuilder()
        .update()
        .set({
            email: user.email,
            username: user.username,
            name: user.name
        })
        .where(`user_id = :id`, { id })
        .execute()
    }

    deleteUser(id: string): Promise<any> {
        return this.userRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('user_id = :id', { id })
        .execute()
    }
}
