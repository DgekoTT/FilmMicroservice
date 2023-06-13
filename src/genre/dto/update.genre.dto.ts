import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class UpdateGenreDto {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @IsNumber({}, {message: " Должно быть числом"})
    readonly id: number;

    @ApiProperty({example: 'драма', description: 'название жанра на русском'})
    @IsString({message: " Должно быть строкой"})
    readonly nameRu: string;

    @ApiProperty({example: 'drama', description: 'название жанра на английском'})
    @IsString({message: " Должно быть строкой"})
    readonly nameEn: string;
 }