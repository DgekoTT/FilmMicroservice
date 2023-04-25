import {IsString} from "class-validator";

export class CountryFilmDto {
    @IsString({message: " Должно быть строкой"})
    name: string;
}