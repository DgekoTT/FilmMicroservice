import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class GenreFilmDto {
    @ApiProperty({example: 'Комедия', description: 'название жанра'})
    @IsString({message: " Должно быть строкой"})
    name: string;
}