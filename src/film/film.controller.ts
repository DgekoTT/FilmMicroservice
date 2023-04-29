
import {
    Body,
    Controller,
    Get, Inject, Param,
    Post,
    Put,
} from '@nestjs/common';
import {FilmService} from "./film.service";

import {CreateFilmDto} from "./dto/create-film.dto";
import {UpdateFilmDto} from "./dto/update-film.dto";
import {Film} from "./film.model";
import {GenreFilmDto} from "./dto/genre-film.dto";
import {CountryFilmDto} from "./dto/get.country-film.dto";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";




@Controller('films')
export class FilmController {


    constructor(private filmService: FilmService,
                @Inject("FILM_SERVICE") private readonly client: ClientProxy) {
    }

    // @Roles("admin")
    // @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post()
    async createFilm(@Body() dto: CreateFilmDto): Promise<any> {
        let film = await this.filmService.createFilm(dto);
        const personDto = await this.filmService.makePersonDto(dto, film.id);
        const persons = await firstValueFrom(this.client.send({cmd: 'createPersons'}, JSON.stringify(personDto)))
        const filmInfo = this.filmService.makeFilmInfo(film);
        return [filmInfo, persons];
    }

    @Post('/load')
    loadFilms(): Promise<string>{
        return this.filmService.loadFilms();
    }


    // @Roles("admin")
    // @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Put('/update')
    updateFilm(@Body() dto: UpdateFilmDto,): Promise<string> {
        return this.filmService.updateFilm(dto);
    }

    @Get('/:id')
    async getFilmById(@Param('id') id: number): Promise<{}>{
        const persons = await this.filmService.getPersons(id);
        const film = await this.filmService.getFilmById(id);
        const filmInfo = this.filmService.makeFilmInfo(film);
        return [filmInfo, persons];
    }

    @Get("/rating/:rating")
    async getFilmRating(@Param('rating') rating: number): Promise<Film[]> {
        /*мы получим фильмы без персонала, когда из списка мы выбираем
        один фильм, то делаем отдельный запрос фильма по ид, тогда получим полную информацию
        */
        return this.filmService.getFilmRating(rating);
    }

    @Get("/amount/:amount")
    async getFilmRatingVoteCount(@Param('amount') amount: number): Promise<Film[]> {
        /*мы получим фильмы без персонала, когда из списка мы выбираем
        один фильм, то делаем отдельный запрос фильма по ид, тогда получим полную информацию
        */
        return this.filmService.getFilmRatingVoteCount(amount);
    }

    @Get('genre')
    getFilmByGenre(@Body() dto: GenreFilmDto,): Promise<Film[]> {
        /*мы получим фильмы без персонала, когда из списка мы выбираем
        один фильм, то делаем отдельный запрос фильма по ид, тогда получим полную информацию
        */
        return this.filmService.getFilmByGenre(dto.name);
    }

    @Get('country')
    async getFilmCountry(@Body() dto: CountryFilmDto): Promise<Film[]> {
        /*мы получим фильмы без персонала, когда из списка мы выбираем
        один фильм, то делаем отдельный запрос фильма по ид, тогда получим полную информацию
         */
        const film = this.filmService. getFilmCountry(dto.name)
        return film;
    }

    @Get('/sorting')
    getSortedFilms(@Body() sortBy: string[], sortOrder: string): Promise<Film[]>{
        return this.filmService.getSortedFilms(sortBy, sortOrder);
    }


}
