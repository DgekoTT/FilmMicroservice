
import {Body, Controller, Get, Param, Post, Put, UseGuards} from "@nestjs/common";
import {CreateGenreDto} from "./dto/create.genre.dto";
import {GenreService} from "./genre.service";
import {UpdateGenreDto} from "./dto/update.genre.dto";
import {Genres} from "./genre.model";
import {Roles} from "../Guards/roles-auth.decorator";
import {RolesGuard} from "../Guards/role.guard";


@Controller('genres')
export class GenreController {


    constructor(private genreService: GenreService) {}

    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post()
    createGenre(@Body() dto: CreateGenreDto): Promise<Genres>{
        return this.genreService.createGenre(dto)
    }

    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Put('/update')
    updateGenre(@Body() dto: UpdateGenreDto): Promise<string> {
        return this.genreService.updateGenre(dto);
    }

    @Get()
    getAllGenres(): Promise<Genres[]> {
        return this.genreService.getAllGenres();
    }

    @Get("/:id")
    getGenreById(@Param('id') id: number): Promise<Genres> {
        return this.genreService.getGenreById(id);
    }

    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post('load')
    async loadGenres(): Promise<string> {
        return this.genreService.loadGenres();
    }
}
