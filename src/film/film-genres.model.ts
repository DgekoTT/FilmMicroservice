import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Film} from "./film.model";
import {Genres} from "../genre/genre.model";



@Table({tableName: 'GenresFilm', createdAt: false, updatedAt: false})//появится таблица с именем UserRoles
export class GenresFilm extends Model<GenresFilm> {


    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Genres)
    @Column({type: DataType.INTEGER, field: 'genreId'})
    genreId: number;

}