
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {FilmService} from "./film.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateFilmDto} from "./dto/create-film.dto";



@Controller('blocks')
export class FilmController {


    constructor(private filmService: FilmService) {
    }

    // @Roles("admin")
    // @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post()
    createFilm(@Body() dto: CreateFilmDto){
        return this.filmService.createFilm(dto)
    }

    // @Roles("admin")
    // @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
//     @Put('/update')
//     updateBlock(@Body() dto: UpdateBlocksDto,) {
//         return this.filmService.updateBlock(dto);
//     }
// S
//     @Roles("admin")
//     @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
//     @Delete("/:id")
//     deleteBlock(@Param("id") id: number) {
//         return this.filmService.deleteBlock(id);
//     }
//
//     @Get()
//     getAllBlocks() {
//         return this.filmService.getAllBlock();
//     }
//
//     @Get("/:group")
//     getBlocksByGroup(@Param("group") group: string) {
//         return this.filmService. getBlockByGroup(group);
//     }
}
