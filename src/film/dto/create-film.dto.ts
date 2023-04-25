import {IsNumber, IsString} from "class-validator";

export class CreateFilmDto {
    id?: number;
    @IsString({message: " Должно быть строкой"})
    name: string;
    @IsString({message: " Должно быть строкой"})
    nameEn: string;
    @IsString({message: " Должно быть строкой"})
    type: string;
    @IsString({message: " Должно быть строкой"})
    image: string;
    @IsNumber({}, {message: " Должно быть числом"})
    ratingVoteCount: number;
    @IsNumber({}, {message: " Должно быть числом"})
    rating: number;
    @IsString({message: " Должно быть строкой"})
    countries: string;
    @IsString({message: " Должно быть строкой"})
    genre: string;
    @IsString({message: " Должно быть строкой"})
    filmLength: string;
    @IsNumber({}, {message: " Должно быть числом"})
    year: number;
    @IsString({message: " Должно быть строкой"})
    filmDescription: string;
}