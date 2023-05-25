
import {
    Body,
    Controller,
    Get, Inject, Param,
    Post,
    Put, UseGuards, UsePipes,
} from '@nestjs/common';
import {FilmService} from "./film.service";
import {CreateFilmDto} from "./dto/create-film.dto";
import {UpdateFilmDto} from "./dto/update-film.dto";
import {Film} from "./film.model";
import {GenreFilmDto} from "./dto/genre-film.dto";
import {CountryFilmDto} from "./dto/get.country-film.dto";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {Roles} from "../Guards/roles-auth.decorator";
import {RolesGuard} from "../Guards/role.guard";
import {ApiCookieAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ValidationPipe} from "../pipes/validation.pipe";
import { Helper} from "../helper/makeFilmAndPersons";




@Controller('films')
export class FilmController {


    constructor(private filmService: FilmService,
                @Inject("FILM_SERVICE") private readonly client: ClientProxy,
                private helper: Helper) {

        this.helper = new Helper()
    }


    @ApiOperation({summary: 'получаем 30 фильмы'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Film, isArray: true})
    @Get('/random')
    getRandom30(): Promise<Film[]> {
        return this.filmService.getRandom30();
    }


    @ApiCookieAuth()
    @ApiOperation({summary: 'создание фильма'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Object, isArray: true})
    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @UsePipes(ValidationPipe)
    @Post()
    async createFilm(@Body() dto: CreateFilmDto): Promise<{}> {
        let film = await this.filmService.createFilm(dto);
        const personDto = await this.filmService.makePersonDto(dto, film.id);
        const persons = await firstValueFrom(this.client.send({cmd: 'createPersons'}, JSON.stringify(personDto)))
        const filmInfo = this.filmService.makeFilmInfo(film);
        return this.helper.makeFilmAndPersonsInfo(filmInfo, persons);
    }

    @ApiCookieAuth()
    @ApiOperation({summary: 'загрузка фильмов в бд из файлов через цикл'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: String, isArray: false})
    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post('/load')
    loadFilms(): Promise<string>{
        return this.filmService.loadFilms();
    }

    @ApiCookieAuth()
    @ApiOperation({summary: 'изменения названия фильма на русском и английком'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: String, isArray: false})
    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @UsePipes(ValidationPipe)
    @Put('/update')
    updateFilm(@Body() dto: UpdateFilmDto,): Promise<string> {
        return this.filmService.updateFilm(dto);
    }

    @ApiOperation({summary: 'получения фильма по id'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Object, isArray: true})
    @Get('/id/:id')
    async getFilmById(@Param('id') id: number){
        const persons = await this.filmService.getPersons(id);
        const film = await this.filmService.getFilmById(id);
        const filmInfo = this.filmService.makeFilmInfo(film);
        return this.helper.makeFilmAndPersonsInfo(filmInfo, persons);
    }

    @ApiOperation({summary: 'получения фильма по filmSpId'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Object, isArray: true})
    @Get('/sp/:id')
    async getFilmBySpId(@Param('id') id: number): Promise<{}>{
        const film = await this.filmService.getFilmBySpId(id);
        const persons = await this.filmService.getPersons(film.id);
        const filmInfo = this.filmService.makeFilmInfo(film);
        return this.helper.makeFilmAndPersonsInfo(filmInfo, persons);
    }

    @ApiOperation({summary: 'получаем фильм по рейтингу'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Film, isArray: true})
    @Get("/rating/:rating")
    async getFilmRating(@Param('rating') rating: number): Promise<Film[]> {
        /*мы получим фильмы без персонала, когда из списка мы выбираем
        один фильм, то делаем отдельный запрос фильма по ид, тогда получим полную информацию
        */
        return this.filmService.getFilmRating(rating);
    }

    @ApiOperation({summary: 'получаем фильм по количеству оценок'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Film, isArray: true})
    @Get("/amount/:amount")
    async getFilmRatingVoteCount(@Param('amount') amount: number): Promise<Film[]> {
        /*мы получим фильмы без персонала, когда из списка мы выбираем
        один фильм, то делаем отдельный запрос фильма по ид, тогда получим полную информацию
        */
        return this.filmService.getFilmRatingVoteCount(amount);
    }

    // @ApiOperation({summary: 'получаем фильмы по жанру'})
    // @ApiResponse({status: 200, description: 'Успешный запрос', type: Film, isArray: true})
    // @Get('/genre')
    // getFilmByGenre(@Body() dto: GenreFilmDto,): Promise<Film[]> {
    //     /*мы получим фильмы без персонала, когда из списка мы выбираем
    //     один фильм, то делаем отдельный запрос фильма по ид, тогда получим полную информацию
    //     */
    //     return this.filmService.getFilmByGenre(dto.name);
    // }

    @ApiOperation({summary: 'получаем фильмы по сртране'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Film, isArray: true})
    @Get('/country')
    async getFilmCountry(@Body() dto: CountryFilmDto){
        /*мы получим фильмы без персонала, когда из списка мы выбираем
        один фильм, то делаем отдельный запрос фильма по ид, тогда получим полную информацию
         */
       return this.filmService. getFilmCountry(dto.name)
    }

    @ApiOperation({summary: 'получаем фильмы отсортированные', description: "мы можем передать от 1 до 4 параметров рейтинг, количество оценок, дата выхода, название и так же указать в каком порядке их сортировать"})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Film, isArray: true})
    @Get('/sorting')
    getSortedFilms(@Body() sortBy: string[], sortOrder: string): Promise<Film[]>{
        return this.filmService.getSortedFilms(sortBy, sortOrder);
    }

}
