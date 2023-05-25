import {IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateFilmDto {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @IsNumber({}, {message: " Должно быть числом"})
    @IsOptional()
    id?: number;

    @ApiProperty({example: 123452, description: 'уникальный id из базы кинопоиска, по нему связаны актеры и фильмы'})
    @IsNumber({}, {message: " Должно быть числом"})
    filmSpId: number;

    @ApiProperty({example: 'Мексика', description: 'название фильма на русском'})
    @IsString({message: " Должно быть строкой"})
    name: string;

    @ApiProperty({example: 'Mexico', description: 'название фильма на английском'})
    @IsString({message: " Должно быть строкой"})
    nameEn: string;

    @ApiProperty({example: 'фильм', description: 'фильм, сериал или мультфильм'})
    @IsString({message: " Должно быть строкой"})
    type: string;

    @ApiProperty({example: '"https://st.kp.yandex.net/images/film_iphone/iphone360_5260016.jpg"', description: 'ссылка на постер к фиьму из кинопоиска'})
    @IsString({message: " Должно быть строкой"})
    image: string;

    @ApiProperty({example: '154720', description: 'количество оценок на кинопосике'})
    @IsNumber({}, {message: " Должно быть числом"})
    ratingVoteCount: number;

    @ApiProperty({example: 9.5, description: 'рейтинг фильма'})
    @IsNumber({}, {message: " Должно быть числом"})
    rating: number;

    @ApiProperty({example: "Мексика, Италия", description: 'FK фильмов из таблицы CountriesFilm,', isArray: true})
    @IsString({message: " Должно быть строкой"})
    countries: string;

    @ApiProperty({example: 'Ужасы, Триллер', description: 'FK фильмов из таблицы GenresFilm,', isArray: true})
    @IsString({message: " Должно быть строкой"})
    genre: string;

    @ApiProperty({example: '186', description: 'продолжительность фильма'})
    @IsString({message: " Должно быть строкой"})
    filmLength: string;

    @ApiProperty({example: 1990, description: 'год выпуска'})
    @IsNumber({}, {message: " Должно быть числом"})
    year: number;

    @ApiProperty({example: 'Это страна....', description: 'краткое описание фильма'})
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

}