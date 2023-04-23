import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Countries} from "../countries/countries.model";
import {CountriesFilm} from "./film-countries.model";
import {Actors} from "../actors/actors.model";
import {ActorsFilm} from "./film-actors.model";
import {Genres} from "../genre/genre.model";
import {GenresFilm} from "./film-genres.model";


interface FilmCreationAttrs {
    id?: number;
    name: string;
    nameEn: string;
    type: string;// фильм, сериал или мультфильм
    image: string;// ссылка с кинопоиска на постер фильма
    ratingVoteCount: number;
    rating: number;
    filmLength: string;// продолжительность
    year: number;
    filmDescription: string;
}

@Table({tableName: 'Kino'})//появится таблица с именем films
export class Film extends Model<FilmCreationAttrs> {

    // появятся указанные колонки
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @Column({type: DataType.STRING})
    name: string;

    @Column({type: DataType.STRING})
    nameEn: string;

    @Column({type: DataType.STRING})
    type: string;// фильм, сериал или мультфильм

    @Column({type: DataType.STRING})
    image: string;

    @Column({type: DataType.INTEGER})
    ratingVoteCount: number;

    @Column({type: DataType.INTEGER})
    rating: number;

    @BelongsToMany(()=> Countries, ()=> CountriesFilm)
    countries: Countries[];

    @BelongsToMany(()=> Actors, ()=> ActorsFilm)
    actors: Actors[];

    @BelongsToMany(()=> Genres, ()=> GenresFilm)
    genre: Genres[];

    @Column({type: DataType.INTEGER})
    year: number;

    @Column({type: DataType.STRING})
    filmLength: string;

    @Column({type: DataType.STRING})
    filmDescription: string;

}