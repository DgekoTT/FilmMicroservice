
import {

    Controller, Post,

} from '@nestjs/common';
import {CountriesService} from "./countries.service";

@Controller('blocks')
export class CountriesController {


    constructor(private countriesService: CountriesService) {}

    @Post('c')
    loadCountries(): Promise<string> {
        return this.countriesService.loadCountries();
    }
//     @Roles("admin")
//     @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
//     @Post()
//     @UseInterceptors(FileInterceptor('image'))//для работы с файлами
//     createBlock(@Body() dto: CreateFilmDto,
//                //получить файл
//                @UploadedFile() image){
//         return this.blockService.createBlocks(dto, image)
//     }
//
//     @Roles("admin")
//     @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
//     @Put('/update')
//     @UseInterceptors(FileInterceptor('image'))//для работы с файлами
//     updateBlock(@Body() dto: UpdateFilmDto,
//                 @UploadedFile() image) {
//         return this.blockService.updateBlock(dto, image);
//     }
// S
//     @Roles("admin")
//     @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
//     @Delete("/:id")
//     deleteBlock(@Param("id") id: number) {
//         return this.blockService.deleteBlock(id);
//     }
//
//     @Get()
//     getAllBlocks() {
//         return this.blockService.getAllBlock();
//     }
//
//     @Get("/:group")
//     getBlocksByGroup(@Param("group") group: string) {
//         return this.blockService. getBlockByGroup(group);
//     }
}
