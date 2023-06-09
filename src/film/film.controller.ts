
import {
    Body,
    CacheInterceptor,
    Controller,
    Get, Inject, Param,
    Post,
    Put, Query, UseGuards, UseInterceptors, UsePipes,
} from '@nestjs/common';
import {FilmService} from "./film.service";
import {CreateFilmDto} from "./dto/create-film.dto";
import {UpdateFilmDto} from "./dto/update-film.dto";
import {Film} from "./film.model";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {Roles} from "../Guards/roles-auth.decorator";
import {RolesGuard} from "../Guards/role.guard";
import {ApiCookieAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ValidationPipe} from "../pipes/validation.pipe";
import { Helper} from "../helper/makeFilmAndPersons";
import {FilmAndPersonsInfo, FilmInfo} from "../interfaces/film.interfacs";
import {FilterFilmDto} from "./dto/filter-film.dto";
import {FilmNameDto} from "./dto/name-film.dto";
import { CacheTTL } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';





@Controller('films')
export class FilmController {


    constructor(private filmService: FilmService,
                @Inject("FILM_SERVICE") private readonly client: ClientProxy,
                @Inject(CACHE_MANAGER) private cacheManager: Cache,
                private helper: Helper) {

        this.helper = new Helper()
    }


    @ApiOperation({summary: 'получаем 30 фильмы'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Film, isArray: true})
    @Get('/random')
    getRandom30(): Promise<FilmInfo[]> {
        return this.filmService.getRandom30();
    }


    @ApiCookieAuth()
    @ApiOperation({summary: 'создание фильма'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Object, isArray: true})
    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @UsePipes(ValidationPipe)
    @Post()
    async createFilm(@Body() dto: CreateFilmDto): Promise<string> {
        let film = await this.filmService.createFilm(dto);
        const personDto = await this.filmService.makePersonDto(dto, film.id);
        const persons = await firstValueFrom(this.client.send({cmd: 'createPersons'}, JSON.stringify(personDto)))
        return `Фильм успешно создан id ${film.id}`;
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

    @ApiOperation({summary: 'получения фильмов, обрабатывает различные фильтры'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Object, isArray: true})
    @Get('/filters')
    async getFilmsByFilters(@Query() filters: FilterFilmDto)  : Promise<FilmInfo[] | {message: string}>   {
        return await this.filmService.getFilmsByFilters(filters);
    }

    @ApiOperation({summary: 'получения фильма по id'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Object, isArray: true})
    @Get('/id/:id')
    @CacheTTL(60)
    @UseInterceptors(CacheInterceptor)
    async getFilmById(@Param('id') id: number): Promise<FilmAndPersonsInfo>{
        return await this.getFilmByAllId(id, 'id')
    }

    @ApiOperation({summary: 'получаем первый 10 фильмов по строке по строке'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: String, isArray: false})
    @Get('/name')
    @CacheTTL(60)
    getFilmsByName(@Query() name : FilmNameDto) : Promise<FilmInfo[]> {
        return this.filmService.getFilmsByName(name);
    }

    @ApiOperation({summary: 'получения фильма по filmSpId'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Object, isArray: true})
    @Get('/sp/:id')
    @CacheTTL(60)
    async getFilmBySpId(@Param('id') id: number): Promise<FilmAndPersonsInfo>{
        return await this.getFilmByAllId(id, 'sp')
    }

    async getFilmByAllId(id: number, code: string) {
        const cacheKey = `getFilmBy${code}:${id}`;
        const cachedData = await this.cacheManager.get<FilmAndPersonsInfo>(cacheKey);
      
        if (cachedData) {
          return cachedData;
        }

        const film = (code == 'id') ? await this.filmService.getFilmById(id) : await this.filmService.getFilmBySpId(id)
        const persons = await this.filmService.getPersons(film.id);
        const filmInfo = this.filmService.makeFilmInfo(film);
        const filmAndPersonsInfo = this.helper.makeFilmAndPersonsInfo(filmInfo, persons);
      
        await this.cacheManager.set(cacheKey, filmAndPersonsInfo);
      
        return filmAndPersonsInfo;
    }
}
