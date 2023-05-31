
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Genres} from "./genre.model";
import {CreateGenreDto} from "./dto/create.genre.dto";
import {UpdateGenreDto} from "./dto/update.genre.dto";
import {Op, QueryTypes} from "sequelize";
import * as fs from "fs";
import { GenresFilm } from 'src/film/film-genres.model';
import sequelize from 'sequelize';


@Injectable()
export class GenreService {

    constructor(@InjectModel(Genres) private genreRepository: typeof Genres,
                @InjectModel(GenresFilm) private repositoryGenresFilm: typeof GenresFilm) {
    }
    async createGenre(dto: CreateGenreDto) {
        return await this.genreRepository.create(dto);
    }
м
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
                nameRu: { [Op.in]: genre }
            }
        })
    }


    async getFilmIds(genre: string): Promise<number[]> {
      const genreIds: number[] = await this.getGenreId(genre);
    
      const filmsGenre: any[] = await this.repositoryGenresFilm.findAll({
        attributes: ['filmId'],
        where: {
          genreId: {
            [Op.in]: genreIds
          }
        },
        group: ['filmId'],
        having: sequelize.literal(`COUNT(DISTINCT CASE WHEN "genreId" IN (${genreIds.join(',')}) THEN "genreId" END) = ${genreIds.length}`)
      });
      
      return filmsGenre.map((el) => el.filmId);
    }
    
    
        

    async getGenreId(genre: string): Promise<number[]> {
        const genres =  await this.genreRepository.findAll({
            where: {
                [Op.or]: genre.split(',').map((genre) => ({
                    nameEn: genre
                }))
            }
        })
        return genres.map(el => el.id);
    }

    //загружаем жанры из файла в базу
   async loadGenres(): Promise<string> {
       try {
           let data = fs.readFileSync('./src/genre/genre.txt', 'utf8').split('\n');
           let genres = data.map(el =>{
               let names = el.split(' ')
               return {nameRu: `${names[0].trim()}`, nameEn: `${names[1].trim()}`}
           });
            let res = await this.genreRepository.bulkCreate(genres);
       } catch (err) {
           console.error(err);
           throw new HttpException('Ошибка загрузки', HttpStatus.INTERNAL_SERVER_ERROR)
       }
       return `Жанры загружены в базу данных `
    }

}
