
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


@Controller('actors')
export class ActorsController {
//
//
//     constructor(private actorsService: CountriesService) {
//     }
//

//
//     @Roles("admin")
//     @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
//     @Put('/update')
//     @UseInterceptors(FileInterceptor('image'))//для работы с файлами
//     updateBlock(@Body() dto: UpdateBlocksDto,
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
