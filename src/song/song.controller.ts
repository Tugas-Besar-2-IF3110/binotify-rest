import { Controller, Post, Body, Get, Put, Delete, Param, Req } from '@nestjs/common';
import { SongService } from './song.service';
import { Song } from './song.entity';
import * as jwt from 'jsonwebtoken';

@Controller('song')
export class SongController {
    constructor(private songService: SongService) {}
    
    @Post()
    async createSong(@Body() song: any) {
        const newSong = await this.songService.createSong(song);
        if(!newSong) {
            return 'Error in creating song';
        }
        return newSong;
    }

    @Get('all')
    async findAllSong(@Req() req: any) {
        return await this.songService.findAllSong();
    }

    @Get()
    async findSongByPenyanyi(@Req() req: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return await this.songService.findSongByPenyanyiId(decodedToken.userId);
        } else {
            return await Promise.resolve({"error": "Unauthorized"});
        }
    }

    @Put(':id')
    async updateSong(@Param('id') id: string, @Body() body: any) {
        const newSong: any = await this.songService.updateSong(id, body);
        return newSong;
    }

    @Delete(':id')
    async deleteSong(@Param('id') id: string) {
        return await this.songService.deleteSong(id);
    }
}
