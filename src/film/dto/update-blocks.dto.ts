import {IsString} from "class-validator";

export class UpdateBlocksDto {
    id: number
    @IsString({message: " Должно быть строкой"})
    uniqueTitle: string;
    @IsString({message: " Должно быть строкой"})
    title: string;
    @IsString({message: " Должно быть строкой"})
    content: string;
    @IsString({message: " Должно быть строкой"})
    group: string;

}