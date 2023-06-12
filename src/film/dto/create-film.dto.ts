import {IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Column, DataType} from "sequelize-typescript";
import {Actors} from "../../interfaces/film.interfacs";

export class CreateFilmDto {

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

    @ApiProperty({example: "Мексика, Италия", description: 'страны', isArray: false})
    @IsString({message: " Должно быть строкой"})
    countries: string;

    @ApiProperty({example: 'ужасы, триллер', description: 'жанры', isArray: false})
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

    @ApiProperty({example: 'Сергей Стрижак', description: 'Режиссер'})
    @IsString({message: " Должно быть строкой"})
    director: string;

    @ApiProperty({example: 'Айдар Акманов, Мустай Карим', description: 'сценарист'})
    @IsString({message: " Должно быть строкой"})
    scenario: string;

    @ApiProperty({example: 'Тимербулат Каримов, Михаил Курбатов, Дмитрий Фикс', description: 'продюссер'})
    @IsString({message: " Должно быть строкой"})
    producer: string;

    @ApiProperty({example: 'Михаил Агранович', description: 'оператор'})
    @IsString({message: " Должно быть строкой"})
    operator: string;

    @ApiProperty({example: 'Илья Духовный', description: 'композитор'})
    @IsString({message: " Должно быть строкой"})
    composer: string;

    @ApiProperty({example: 'Вячеслав Виданов, Янина Боуден', description: 'художник'})
    @IsString({message: " Должно быть строкой"})
    painter: string;

    @ApiProperty({example: 'Игорь Медведев', description: 'инсталяция'})
    @IsString({message: " Должно быть строкой"})
    installation: string;

}