
import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
import {CreateGenreDto} from "./dto/create.genre.dto";
import {GenreService} from "./genre.service";
import {UpdateGenreDto} from "./dto/update.genre.dto";


@Controller('genres')
export class CountriesController {


    constructor(private genreService: GenreService) {
    }

//     @Roles("admin")
//     @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post()
    createGenre(@Body() dto: CreateGenreDto){
        return this.genreService.createGenre(dto)
    }

//     @Roles("admin")
//     @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Put('/update')
    updateGenre(@Body() dto: UpdateGenreDto) {
        return this.genreService.updateGenre(dto);
    }

    @Get()
    getAllGenres() {
        return this.genreService.getAllGenres();
    }

    @Get("/:id")
    getGenreById(@Param('id') id: number) {
        return this.genreService.getGenreById(id);
    }
}
