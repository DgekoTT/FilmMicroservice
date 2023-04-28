import {IsNumber, IsString} from "class-validator";

export class CreateFilmDto {
    @IsNumber({}, {message: " Должно быть числом"})
    id: number;
    @IsNumber({}, {message: " Должно быть числом"})
    filmSpId: number;
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
    @IsString({message: " Должно быть строкой"})
    director: string;
    @IsString({message: " Должно быть строкой"})
    scenario: string;
    @IsString({message: " Должно быть строкой"})
    producer: string;
    @IsString({message: " Должно быть строкой"})
    operator: string;
    @IsString({message: " Должно быть строкой"})
    composer: string;
    @IsString({message: " Должно быть строкой"})
    painter: string;
    @IsString({message: " Должно быть строкой"})
    installation: string;
    actors?: {}
}