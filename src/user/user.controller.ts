import { Controller, Post, Body, Get, Put, Delete, Param, Req} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Post()
    async create(@Body() user: any) {
        const newUser = await this.userService.create(user);
        if(!newUser) {
            return 'error in creating user';
        }
        return 'user created successfully';
    }

    @Get()
    async findAll(@Req() request: Request) {
        const user: Array<User> = await this.userService.findAll();
        return user
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        const newUser: any = await this.userService.update(id, body);
        return "user updated";
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.userService.delete(id);
        return "user deleted";
    }
}
