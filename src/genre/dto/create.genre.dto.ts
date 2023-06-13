import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateGenreDto {
    @ApiProperty({example: 'драма', description: 'название жанра на русском'})
    @IsString({message: " Должно быть строкой"})
    readonly nameRu: string;

    @ApiProperty({example: 'drama', description: 'название жанра на английском'})
    @IsString({message: " Должно быть строкой"})
    readonly nameEn: string;
 }