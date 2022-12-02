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
        return this.userRepository
        .createQueryBuilder('penyanyi')
        .where('isAdmin = false')
        .select(['penyanyi.user_id', 'penyanyi.name'])
        .getMany();
    }

    findAdmin(): Promise<User> {
        return this.userRepository
        .createQueryBuilder('admin')
        .where('isAdmin = true')
        .select('admin.email')
        .getOne();
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
}
