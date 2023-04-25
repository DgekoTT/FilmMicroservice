
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateFilmDto} from "./dto/create-film.dto";
import {Film} from "./film.model";
import {GenreService} from "../genre/genre.service";
import {CountriesService} from "../countries/countries.service";
import {UpdateFilmDto} from "./dto/update-film.dto";
import {Model} from "sequelize-typescript";




@Injectable()
export class FilmService {
    //что бы иметь доступ к базе, инжектим модель бд
    constructor(@InjectModel(Film) private filmRepository: typeof Film,
                private genreService: GenreService,
                private countriesService: CountriesService) {}

    async createFilm(dto: CreateFilmDto) {
        const newFilm = await this.filmRepository.create(dto);
        const countriesObj = await this.countriesService.getCountries(dto.countries.split(','))
        const countriesId = countriesObj.map(el => el.id);
        await newFilm.$set('countries', countriesId);
        const genreObj = await  this.genreService.getGenre(dto.genre.split(', '));
        const genresId = genreObj.map(el=> el.id);
        await newFilm.$set('genre', genresId);
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
        const film = await this.filmRepository.findOne({where: {id}, include: {all: true}});
        return film;

    }


    async checkerFilm(id: number ): Promise<Film> {
        const isFilm = await this.getFilmById(id);
        if (!isFilm) {
            throw new HttpException('Блок с данным id не найден', HttpStatus.NOT_FOUND)
        }
        return isFilm;
    }


    async getFilmByGenre(genre: string): Promise<Film[]> {
        const genreObj = await this.genreService.getGenreId(genre);
        const filmByGenre = await this.filmRepository.findAll({
            where: {
                // @ts-ignore
                genre: `${genreObj.id}`
            }
        });
        return filmByGenre;
    }

    async getFilmCountry(country: string): Promise<Film[]>  {
        const countryObj = await this.countriesService.getCountryId(country);
        const filmByCountry = await this.filmRepository.findAll({
            where: {
                // @ts-ignore
                countries: `${countryObj.id}`
            }
        });
        return filmByCountry;
    }
}
