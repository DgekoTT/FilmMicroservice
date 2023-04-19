//nest generate service posts


import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Block} from "./film.model";
import {FilesService} from "../files/files.service";
import {CreateBlocksDto} from "./dto/create-blocks.dto";
import {UpdateBlocksDto} from "./dto/update-blocks.dto";

@Injectable()
export class FilmService {
    //что бы иметь доступ к базе, инжектим модель бд
    constructor(@InjectModel(Block) private blockRepository: typeof Block,
                //для работы с файлами
                private fileService: FilesService) {
    }



    async createBlocks(dto: CreateBlocksDto, image) {
        const fileName = await this.fileService.createFile(image);
        const block = await this.blockRepository.create({...dto, image: fileName});
        //записываем файл в бд
        const newFile = await this.fileService.createFileToDb(fileName, "Blocks", block.id)
        return block;
    }

    async updateBlock(dto: UpdateBlocksDto, image: any) {

        await this.checkerBlock(dto.id);

        let fileName, success;

        if (image){
             fileName = await this.fileService.createFile(image);

            success = await this.blockRepository.update({...dto, image: fileName},{
                where: {
                    id: `${dto.id}`
                }
            })
        } else {
             success = await this.blockRepository.update({...dto},{
                where: {
                    id: `${dto.id}`
                }
            })
        }

        return success;



    }

    async getBlockById(id: number) {
        const block = await this.blockRepository.findOne({where: {id}});
        return block;

    }

     async checkerBlock(id ) {
        const isBlock = await this.getBlockById(id);
        if (!isBlock) {
            throw new HttpException('Блок с данным id не найден', HttpStatus.NOT_FOUND)
        }
    }

     async deleteBlock(id: number) {
         await this.checkerBlock(id);
         //удаляем файлы относящиеся к текст-блоку
         await this.fileService.deleteFile("Blocks", id)


         const success = await this.blockRepository.destroy({
             where: {
                 id: `${id}`
             }
         })
         return success;
    }

    async getAllBlock() {
        const allBlocks = await this.blockRepository.findAll();
        return allBlocks;
    }

    async getBlockByGroup(group: string) {
        const blocksByGroup = await this.blockRepository.findAll({
            where: {
                group: `${group}`
            }
        });
        return blocksByGroup;
    }
}
