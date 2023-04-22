import {IsString} from "class-validator";

export class GenreFilmDto {
    @IsString({message: " Должно быть строкой"})
    name: string;
}