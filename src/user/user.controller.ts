import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Post()
    async createUser(@Body() user: any) {
        user.password = await bcrypt.hash(user.password, 10);
        const newUser = await this.userService.createUser(user);
        if(!newUser) {
            return 'Error in creating user';
        }
        newUser.token = jwt.sign({userId: newUser.user_id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET_KEY);
        return newUser;
    }

    @Get()
    async findAllUser() {
        const user: Array<User> = await this.userService.findAllUser();
        return user;
    }

    @Get('check-username/:username')
    async checkUserByUsername(@Param('username') username: string) {
        const regex = new RegExp('^[a-zA-Z0-9_]+$');
        if (regex.test(username)) {
            return await this.userService.findUserByUsername(username);
        } else {
            return await Promise.resolve({"error": "Username harus berupa gabungan alphabet, angka, dan underscore"});
        }
    }

    @Get('check-email/:email')
    async checkUserByEmail(@Param('email') email: string) {
        const regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');
        if (regex.test(email)) {
            return await this.userService.findUserByEmail(email);
        } else {
            return await Promise.resolve({"error": "Email tidak valid"});
        }
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() body: any) {
        const newUser: any = await this.userService.updateUser(id, body);
        return newUser;
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.deleteUser(id);
    }
}
