import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Countries} from "../countries/countries.model";
import {CountriesFilm} from "./film-countries.model";
import {Actors} from "../actors/actors.model";
import {ActorsFilm} from "./film-actors.model";
import {Genres} from "../genre/genre.model";
import {GenresFilm} from "./film-genres.model";


interface FilmCreationAttrs {
    id: number;
    name: string;
    nameEn: string;
    marksAmount: number;
    rating: number;
    countries: string;
    actors: string;
    worldPremiere: number;
    filmDescription: string;
    comments: number;
}

@Table({tableName: 'films'})//появится таблица с именем films
export class Film extends Model<FilmCreationAttrs> {

    // появятся указанные колонки
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @Column({type: DataType.STRING})
    name: string;

    @Column({type: DataType.STRING})
    nameEn: string;

    @Column({type: DataType.NUMBER})
    marksAmount: number;

    @Column({type: DataType.NUMBER})
    rating: number;

    @BelongsToMany(()=> Countries, ()=> CountriesFilm)
    countries: Countries[];

    @BelongsToMany(()=> Actors, ()=> ActorsFilm)
    actors: Actors[];

    @BelongsToMany(()=> Genres, ()=> GenresFilm)
    genre: Genres[];

    @Column({type: DataType.NUMBER})
    year: number;

    @Column({type: DataType.STRING})
    filmDescription: string;

}