import { Controller, Post, Body, Get, Put, Delete, Param, Req} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Post()
    async createUser(@Body() user: any) {
        const newUser = await this.userService.createUser(user);
        if(!newUser) {
            return 'Error in creating user';
        }
        return newUser;
    }

    @Get()
    async findAllUser(@Req() request: Request) {
        const user: Array<User> = await this.userService.findAllUser();
        return user;
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
