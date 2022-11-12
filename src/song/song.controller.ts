import { Controller, Post, Body, Get, Put, Delete, Param, Req, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from  'path';
import * as fs from 'fs';
import { SongService } from './song.service';
import { Song } from './song.entity';
import * as jwt from 'jsonwebtoken';

@Controller('song')
export class SongController {
    constructor(private songService: SongService) {}
    
    @Post('add')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './audio_files', 
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async createSong(@Req() req: any, @Body() song: any, @UploadedFile() file: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            try {
                const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
                song.penyanyi_id = decodedToken.userId;
                song.Audio_path = file.path;
                const newSong = await this.songService.createSong(song);
                if(!newSong) {
                    return 'Error in creating song';
                }
                return newSong;
            } catch(e) {}
        }
        fs.unlink(`${file.path}`, () => {});
        return await Promise.resolve({"error": "Unauthorized"});
    }

    @Get('all')
    async findAllSong() {
        return await this.songService.findAllSong();
    }

    @Get('audio_files/:audioFile')
    async serveAvatar(@Param('audioFile') audioFile: string, @Res() res: any): Promise<any> {
        res.sendFile(audioFile, { root: 'audio_files'});
    }

    @Get()
    async findSongByPenyanyi(@Req() req: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            try {
                const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
                return await this.songService.findSongByPenyanyiId(decodedToken.userId);
            } catch(e) {}
        }
        return await Promise.resolve({"error": "Unauthorized"});
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
