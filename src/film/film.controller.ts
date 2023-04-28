
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
        const film = await this.filmService.createFilm(dto);
        const personDto = await this.makePersonDto(dto, film.id);
        const persons = await firstValueFrom(this.client.send({cmd: 'createPersons'}, JSON.stringify(personDto)))
        return {...film, ...persons};
    }


    // @Roles("admin")
    // @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Put('/update')
    updateFilm(@Body() dto: UpdateFilmDto,): Promise<string> {
        return this.filmService.updateFilm(dto);
    }

    @Get('/:id')
    async getFilmById(@Param('id') id: number): Promise<[Film, any]>{
        const persons = await firstValueFrom(this.client.send({cmd: 'getPersons'}, id))
        const film =await this.filmService.getFilmById(id);
        return [film, persons];
    }

    @Get('genre')
    getFilmByGenre(@Body() dto: GenreFilmDto,): Promise<Film[]> {
        return this.filmService.getFilmByGenre(dto.name);
    }

    @Get('country')
    getFilmCountry(@Body() dto: CountryFilmDto,): Promise<Film[]> {
        return this.filmService. getFilmCountry(dto.name);
    }

    async makePersonDto(dto: CreateFilmDto, id: number): Promise<any> {
        const persons = {
            filmId: id,
            director: dto.director,
            scenario: dto.scenario,
            producer: dto.producer,
            operator: dto.operator,
            composer: dto.composer,
            painter: dto.painter,
            installation: dto.installation,
            actors: dto.actors
        }
        return persons;
    }

}
