import { Controller, Post, Body, Get, Put, Delete, Param, Req} from '@nestjs/common';
import { Request } from 'express';
import { SongService } from './song.service';
import { Song } from './song.entity';

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

    @Get()
    async findAllSong(@Req() request: Request) {
        const Song: Array<Song> = await this.songService.findAllSong();
        return Song;
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
