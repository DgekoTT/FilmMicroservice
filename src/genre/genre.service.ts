
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Genres} from "./genre.model";
import {CreateGenreDto} from "./dto/create.genre.dto";
import {UpdateGenreDto} from "./dto/update.genre.dto";
import {Op} from "sequelize";
import * as fs from "fs";


@Injectable()
export class GenreService {

    constructor(@InjectModel(Genres) private genreRepository: typeof Genres) {
    }
    async createGenre(dto: CreateGenreDto) {
        return await this.genreRepository.create(dto);
    }

    async getGenreById(id: number) {
        return await this.genreRepository.findOne({where: {id : id}});
    }

    async getAllGenres() {
        return await this.genreRepository.findAll();
    }

    async updateGenre(dto: UpdateGenreDto) {
        let genre = await this.genreRepository.findOne({where: {id: dto.id}});
        this.checkerGenre(genre);
        let success = await this.genreRepository.update({...dto}, {
            where: {
                id: dto.id
            }
        });
        if (success) return `Жанр успешно обновлен`;
        throw new HttpException('Ошибка обновления жанра', HttpStatus.BAD_REQUEST);
    }


    checkerGenre(genre:any) {
        if (!genre) {
            throw new HttpException('Жанр с данным id не найден', HttpStatus.NOT_FOUND);
        }
    }

    async getGenre(genre: string[]): Promise<Genres[]> {
        genre = genre.map(el => el.trim());
        return await this.genreRepository.findAll({
            where: {
                name: { [Op.in]: genre }
            }
        })
    }

    async getGenreId(genre: string): Promise<Genres> {
        return await this.genreRepository.findOne({
            where: {
                name: {genre}
            }
        })

    }
    //загружаем жанры из файла в базу
   async loadGenres(): Promise<string> {
       try {
           let data = fs.readFileSync('./src/genre/genre.txt', 'utf8').split('\n');
           let genres = data.map(el =>{ return {name: `${el.trim()}`}});
           let res = await this.genreRepository.bulkCreate(genres);
           console.log(res);
       } catch (err) {
           console.error(err);
       }
       return `Жанры загружены в базу данных `
    }

}
