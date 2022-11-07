import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity('song')
export class Song {
    @PrimaryGeneratedColumn()
    song_id: number;
    
    @Column()
    Judul: string;

    @Column()
    penyanyi_id: number;

    @Column()
    Audio_path: string;
}