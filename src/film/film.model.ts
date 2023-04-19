import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Countries} from "../countries/countries.model";
import {CountriesFilm} from "./film-countries.model";


interface FilmCreationAttrs {
    id: number;
    name: string;
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

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @Column({type: DataType.NUMBER})
    marksAmount: number;

    @Column({type: DataType.NUMBER})
    rating: number;


    @BelongsToMany(()=> Countries, ()=> CountriesFilm)
    countries: Countries[];

    // @BelongsToMany(()=> Actors, ()=> ActorsFilm)
    // actors: Actors[];

    @Column({type: DataType.NUMBER})
    worldPremiere: number;

    @Column({type: DataType.STRING})
    filmDescription: string;

}