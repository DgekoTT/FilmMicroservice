//
// import {
//     Body,
//     Controller,
//     Delete,
//     Get,
//     Param,
//     Post,
//     Put,
//     UploadedFile,
//     UseGuards,
//     UseInterceptors
// } from '@nestjs/common';
// import {CountriesService} from "./countries.service";
// import {FileInterceptor} from "@nestjs/platform-express";
// import {CreateFilmDto} from "./dto/create-blocks.dto";
// import {UpdateBlocksDto} from "./dto/update-blocks.dto";
// import {Roles} from "../auth/roles-auth.decorator";
// import {RolesGuard} from "../auth/role.guard";
//
// @Controller('blocks')
// export class CountriesController {
//
//
//     constructor(private blockService: CountriesService) {
//     }
//
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
// }
