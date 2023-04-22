
import {
    Body,
    Controller,
    Get,
    Post,
    Put,
} from '@nestjs/common';
import {FilmService} from "./film.service";

import {CreateFilmDto} from "./dto/create-film.dto";
import {UpdateFilmDto} from "./dto/update-film.dto";
import {Film} from "./film.model";
import {GenreFilmDto} from "./dto/genre-film.dto";



@Controller('films')
export class FilmController {


    constructor(private filmService: FilmService) {
    }

    // @Roles("admin")
    // @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post()
    createFilm(@Body() dto: CreateFilmDto): Promise<Film> {
        return this.filmService.createFilm(dto);
    }

    // @Roles("admin")
    // @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Put('/update')
    updateFilm(@Body() dto: UpdateFilmDto,): Promise<string> {
        return this.filmService.updateFilm(dto);
    }

    @Get('genre')
    getFilmByGenre(@Body() dto: GenreFilmDto,): Promise<Film[]> {
        return this.filmService.getFilmByGenre(dto.name);
    }

}
