import {IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class FilterFilmDto {


    @ApiProperty({example: 'фильм', description: 'фильм, сериал или мультфильм'})
    @IsString({message: " Должно быть строкой"})
    @IsOptional()
    type?: string;

    @ApiProperty({example: 'comedy, drama', description: 'FK фильмов из таблицы GenresFilm,', isArray: true})
    @IsOptional()
    genre?: string;

    @ApiProperty({example: 9.5, description: 'рейтинг фильма от 0 и до 10'})
    @IsNumber({}, {message: " Должно быть числом"})
    @IsOptional()
    rating?: number;

    @ApiProperty({example: "Мексика, Италия", description: 'FK фильмов из таблицы CountriesFilm,', isArray: true})
    @IsString({message: " Должно быть строкой"})
    @IsOptional()
    countries?: string;


    @ApiProperty({example: '154720', description: 'количество оценок на кинопосике'})
    @IsNumber({}, {message: " Должно быть числом"})
    @IsOptional()
    ratingVoteCount?: number;

    @ApiProperty({example: '186', description: 'продолжительность фильма'})
    @IsString({message: " Должно быть строкой"})
    @IsOptional()
    filmLength?: string;

    @ApiProperty({example: 1990, description: 'год выпуска'})
    @IsNumber({}, {message: " Должно быть числом"})
    @IsOptional()
    year?: number;

    @ApiProperty({example: "Мэтт Дэннер", description: 'режисер'})
    @IsString({message: " Должно быть строкой"})
    @IsOptional()
    director?: string;

    @ApiProperty({example: "Дэвид Лодж", description: "актер"})
    @IsString({message: " Должно быть строкой"})
    @IsOptional()
    actor?: string;

    @ApiProperty({example: "rating", description: "сортировка по какому полю "})
    @IsOptional()
    orderBy?: string

    @ApiProperty({example: "ASC", description: "сортировка от большего к меньшему или наоборот "})
    @IsOptional()
    orderDirection?: string

}