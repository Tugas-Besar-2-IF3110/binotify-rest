import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity'

@Injectable()
export class SongService {
    constructor(
        @InjectRepository(Song)
        private songRepository: Repository<Song>
    ) {}

    createSong(song: any): Promise<any> {
        return this.songRepository.save(
          this.songRepository.create(song)
        );
    }

    findAllSong(): Promise<Song[]> {
        return this.songRepository.find();
    }

    updateSong(id: string, song: any): Promise<any> {
        return this.songRepository
        .createQueryBuilder()
        .update()
        .set({
            Judul: song.Judul,
            penyanyi_id: song.penyanyi_id,
            Audio_path: song.Audio_path
        })
        .where(`song_id = :id`, { id })
        .execute()
    }

    deleteSong(id: string): Promise<any> {
        return this.songRepository
        .createQueryBuilder()
        .delete()
        .from(Song)
        .where('song_id = :id', { id })
        .execute()
    }
}
