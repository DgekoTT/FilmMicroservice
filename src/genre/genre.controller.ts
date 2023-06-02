
import {Body, Controller, Get, Param, Post, Put, UseGuards} from "@nestjs/common";
import {CreateGenreDto} from "./dto/create.genre.dto";
import {GenreService} from "./genre.service";
import {UpdateGenreDto} from "./dto/update.genre.dto";
import {Genres} from "./genre.model";
import {Roles} from "../Guards/roles-auth.decorator";
import {RolesGuard} from "../Guards/role.guard";
import {ApiCookieAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";


@Controller('genres')
export class GenreController {


    constructor(private genreService: GenreService) {}

    @ApiOperation({summary: 'создаем жанр для фильма'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Genres, isArray: false})
    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post()
    createGenre(@Body() dto: CreateGenreDto): Promise<Genres>{
        return this.genreService.createGenre(dto)
    }

    @ApiOperation({summary: 'изменяем имя жанра'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: String, isArray: false})
    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Put('/update')
    updateGenre(@Body() dto: UpdateGenreDto): Promise<string> {
        return this.genreService.updateGenre(dto);
    }

    @ApiOperation({summary: 'получаем все жанры'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Genres, isArray: true})
    @Get()
    getAllGenres(): Promise<Genres[]> {
        return this.genreService.getAllGenres();
    }

    @ApiOperation({summary: 'получаем жанр по id'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Genres, isArray: false})
    @Get("/id/:id")
    getGenreById(@Param('id') id: number): Promise<Genres> {
        return this.genreService.getGenreById(id);
    }

    @ApiCookieAuth()
    @ApiOperation({summary: 'загружаем все жанры из файла'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: String, isArray: false})
    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post('load')
    async loadGenres(): Promise<string> {
        return this.genreService.loadGenres();
    }
}
