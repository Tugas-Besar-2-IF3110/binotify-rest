import { Controller, Post, Body, Get, Param, Req, Inject, CACHE_MANAGER } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Controller('user')
export class UserController {
    constructor(private userService: UserService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    
    @Post('register')
    async register(@Body() user: any) {
        user.password = await bcrypt.hash(user.password, 10);
        const newUser = await this.userService.createUser(user);
        if(!newUser) {
            return 'Error in creating user';
        }
        newUser.token = jwt.sign({userId: newUser.user_id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET_KEY);
        return newUser;
    }

    @Post('login')
    async login(@Body() user: any) {
        const getUser: any = await this.userService.findUserByUsername(user.username);
        if (getUser) {
            if (bcrypt.compare(user.password, getUser.password)) {
                getUser.token = jwt.sign({userId: getUser.user_id, isAdmin: getUser.isAdmin}, process.env.JWT_SECRET_KEY);
                return getUser;
            }
        }
        return await Promise.resolve({"error": "Invalid username or password"});
    }

    @Get()
    async findAllUser(@Req() req: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            if (token === process.env.BINOTIFY_APP_API_KEY) {
                let penyanyi: any = await this.cacheManager.get('penyanyi');
                if (penyanyi) {
                    return JSON.parse(penyanyi);
                } else {
                    const user: Array<User> = await this.userService.findAllUser();
                    await this.cacheManager.set('penyanyi', JSON.stringify(user), 86400);
                    return user;
                }
            }
        }
        return await Promise.resolve({"error": "Unauthorized"});
    }

    @Post('admin')
    async findAdmin(@Req() req: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            if (token === process.env.BINOTIFY_SOAP_API_KEY) {
                const user: User = await this.userService.findAdmin();
                return user;
            }
        }
        return await Promise.resolve({"error": "Unauthorized"});
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
}
