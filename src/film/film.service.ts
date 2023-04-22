//nest generate service posts


import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateFilmDto} from "./dto/create-film.dto";

import {Film} from "./film.model";
import {ActorsServiceService} from "../actors/actors.service";
import {GenreService} from "../genre/genre.service";
import {CountriesService} from "../countries/countries.service";
import {UpdateFilmDto} from "./dto/update-film.dto";
import {Model} from "sequelize-typescript";

@Injectable()
export class FilmService {
    //что бы иметь доступ к базе, инжектим модель бд
    constructor(@InjectModel(Film) private filmRepository: typeof Film,
                private actorService: ActorsServiceService,
                private genreService: GenreService,
                private countriesService: CountriesService) {
    }

    async createFilm(dto: CreateFilmDto) {
        // если актера нет, то он будет создан в бд актеров
        let createdActors = await this.actorService.checkActors(dto.actors);
        const actorsId = createdActors.map((actor) => actor.id);
        const newFilm = await this.filmRepository.create(dto);
        await newFilm.$set('actors', actorsId);
        const countriesId = await this.countriesService.getCountries(dto.countries.split(','))
        await newFilm.$set('countries', countriesId);
        const genreId = await  this.genreService.getGenre(dto.genre.split(','));
        await newFilm.$set('genre', genreId);
        return newFilm;
    }

    async updateFilm(dto: UpdateFilmDto): Promise<string> {
    const film = this.checkerFilm(dto.id);
    await this.filmRepository.update(
        {name: dto.name, nameEn: dto.nameEn},
        {where: {id: dto.id}}
    )
        //не стал получать обновленный объект, что бы не терять производительность
    return `Название фильма обновлено на ${dto.name} ${dto.nameEn} `
    }

    async getFilmById(id: number): Promise<Film> {
        const film = await this.filmRepository.findOne({where: {id}})as Film & Model<Film>;
        return film;

    }


    async checkerFilm(id: number ): Promise<Film> {
        const isFilm = await this.getFilmById(id);
        if (!isFilm) {
            throw new HttpException('Блок с данным id не найден', HttpStatus.NOT_FOUND)
        }
        return isFilm;
    }

    // в жанрах хранятся id может не работать
    async getFilmByGenre(genre: string): Promise<Film[]> {
        const genreObj = await this.genreService.getGenreId(genre);
        const filmByGenre = await this.filmRepository.findAll({
            where: {
                genre: `${genreObj.id}`
            }
        });
        return filmByGenre;
    }

}
