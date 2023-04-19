import {IsString} from "class-validator";

export class CreateBlocksDto {
    @IsString({message: " Должно быть строкой"})
    uniqueTitle: string;
    @IsString({message: " Должно быть строкой"})
    title: string;
    @IsString({message: " Должно быть строкой"})
    content: string;
    @IsString({message: " Должно быть строкой"})
    image: string;
    @IsString({message: " Должно быть строкой"})
    group: string;
}