import { Controller, Post, Body, Get, Put, Delete, Param, Req, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from  'path';
import * as fs from 'fs';
import { SongService } from './song.service';
import { Song } from './song.entity';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { xml2json } from 'xml-js';

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
                if (song.Judul) {
                    const newSong = await this.songService.createSong(song);
                    return newSong;
                }
            } catch(e) {}
        }
        fs.unlink(`${file.path}`, () => {});
        return await Promise.resolve({"error": "Unauthorized"});
    }

    @Get('audio_files/:audioFile')
    async findAudioFile(@Param('audioFile') audioFile: string, @Res() res: any): Promise<any> {
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
    
    @Get('creator/:creatorId/subscriber/:subscriberId')
    async findSongByCreatorAndSubscriber(@Req() req: any, @Param('creatorId') creatorId: string, @Param('subscriberId') subscriberId: string, @Res() res: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            if (token === process.env.BINOTIFY_APP_API_KEY) {
                let subscribed = false;
                await axios.post(`${process.env.BINOTIFY_SOAP_API}/subscription`,
                    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sub="http://subscription.binotify/">\
                        <soapenv:Header/>\
                        <soapenv:Body>\
                        <sub:validateSubscription>\
                            <request>\
                                <API_KEY>${process.env.API_KEY}</API_KEY>\
                                <creatorId>${creatorId}</creatorId>\
                                <subscriberId>${subscriberId}</subscriberId>\
                            </request>\
                        </sub:validateSubscription>\
                        </soapenv:Body>\
                    </soapenv:Envelope>`, {
                        headers: {
                            'Content-Type': 'text/xml'
                        }
                    }                    
                ).then(response => {
                    const data = JSON.parse(xml2json(response.data, { spaces: 2, compact: true }));
                    subscribed = JSON.parse(data["S:Envelope"]["S:Body"]["ns2:validateSubscriptionResponse"]["return"]["subscribed"]._text);
                });
                if (subscribed) {
                    res.send(await this.songService.findSongByPenyanyiId(creatorId))
                } else {
                    res.send(await Promise.resolve({"error": "Unauthorized"}));
                }
            } else {
                res.send(await Promise.resolve({"error": "Unauthorized"}));
            }
        } else {
            res.send(await Promise.resolve({"error": "Unauthorized"}));
        }
    }

    @Get(':id')
    async findSongById(@Req() req: any, @Param('id') id: string) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            try {
                const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const song: Song = await this.songService.findSongBySongId(id);
                if (song.penyanyi_id === decodedToken.userId) {
                    return song;
                }
            } catch(e) {}
        }
        return await Promise.resolve({"error": "Unauthorized"});
    }

    @Put('title/:id')
    async updateSongTitle(@Req() req: any, @Param('id') id: string, @Body() song_req: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            try {
                const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const song: Song = await this.songService.findSongBySongId(id);
                if (song.penyanyi_id === decodedToken.userId) {
                    song_req.Audio_path = song.Audio_path;
                    if (song_req.Judul) {
                        const newSong: any = await this.songService.updateSong(id, song_req);
                        return newSong;
                    }
                }
            } catch(e) {}
        }
        return await Promise.resolve({"error": "Unauthorized"});
    }

    @Put('all/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './audio_files', 
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async updateSong(@Req() req: any, @Param('id') id: string, @Body() song_req: any, @UploadedFile() file: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            try {
                const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const song: Song = await this.songService.findSongBySongId(id);
                if (song.penyanyi_id === decodedToken.userId) {
                    fs.unlink(`${song.Audio_path}`, () => {});
                    song_req.Audio_path = file.path;
                    if (song_req.Judul) {
                        const newSong: any = await this.songService.updateSong(id, song_req);
                        return newSong;
                    }
                }
            } catch(e) {}
        }
        fs.unlink(`${file.path}`, () => {});
        return await Promise.resolve({"error": "Unauthorized"});
    }

    @Delete(':id')
    async deleteSong(@Req() req: any, @Param('id') id: string) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            try {
                const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const song: Song = await this.songService.findSongBySongId(id);
                if (song.penyanyi_id === decodedToken.userId) {
                    fs.unlink(`${song.Audio_path}`, () => {});
                    return await this.songService.deleteSong(id);
                }
            } catch(e) {}
        }
        return await Promise.resolve({"error": "Unauthorized"});
    }
}
