import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Countries} from "../countries/countries.model";
import {CountriesFilm} from "./film-countries.model";
import {Genres} from "../genre/genre.model";
import {GenresFilm} from "./film-genres.model";
import {ApiProperty} from "@nestjs/swagger";


interface FilmCreationAttrs {
    id: number;
    name: string;
    nameEn: string;
    type: string;// фильм, сериал или мультфильм
    image: string;// ссылка с кинопоиска на постер фильма
    ratingVoteCount: number;
    rating: number;
    filmLength: string;// продолжительность
    year: number;
    filmDescription: string;
    filmSpId: number;
}

@Table({tableName: 'Films'})//появится таблица с именем films
export class Film extends Model<FilmCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @ApiProperty({example: 123452, description: 'уникальный id из базы кинопоиска, по нему связаны актеры и фильмы'})
    @Column({type: DataType.INTEGER})
    filmSpId: number;

    @ApiProperty({example: 'Мексика', description: 'название фильма на русском'})
    @Column({type: DataType.STRING})
    name: string;

    @ApiProperty({example: 'Mexico', description: 'название фильма на английском'})
    @Column({type: DataType.STRING})
    nameEn: string;

    @ApiProperty({example: 'фильм', description: 'фильм, сериал или мультфильм'})
    @Column({type: DataType.STRING})
    type: string;// фильм, сериал или мультфильм

    @ApiProperty({example: '"https://st.kp.yandex.net/images/film_iphone/iphone360_5260016.jpg"', description: 'ссылка на постер к фиьму из кинопоиска'})
    @Column({type: DataType.TEXT})
    image: string;

    @ApiProperty({example: '154720', description: 'количество оценок на кинопосике'})
    @Column({type: DataType.INTEGER})
    ratingVoteCount: number;

    @ApiProperty({example: 9.5, description: 'рейтинг фильма'})
    @Column({type: DataType.DOUBLE})
    rating: number;

    @ApiProperty({example: [1, 2], description: 'FK фильмов из таблицы CountriesFilm,', isArray: true})
    @BelongsToMany(()=> Countries, ()=> CountriesFilm)
    countries: Countries[];

    @ApiProperty({example: [1, 2], description: 'FK фильмов из таблицы GenresFilm,', isArray: true})
    @BelongsToMany(()=> Genres, ()=> GenresFilm)
    genre: Genres[];

    @ApiProperty({example: 1990, description: 'год выпуска'})
    @Column({type: DataType.INTEGER})
    year: number;

    @ApiProperty({example: '186', description: 'продолжительность фильма'})
    @Column({type: DataType.STRING})
    filmLength: string;

    @ApiProperty({example: 'Это страна....', description: 'краткое описание фильма'})
    @Column({type: DataType.TEXT})
    filmDescription: string;

}