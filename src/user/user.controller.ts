import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
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
    async findAllUser() {
        const user: Array<User> = await this.userService.findAllUser();
        return user;
    }

    @Get('check-username/:username')
    async findUserByUsername(@Param('username') username: string) {
        return await this.userService.findUserByUsername(username);
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
