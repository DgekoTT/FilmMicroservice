import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Film} from "./film.model";
import {Countries} from "../countries/countries.model";



@Table({tableName: 'GenresFilm', createdAt: false, updatedAt: false})//появится таблица с именем UserRoles
export class GenresFilm extends Model<GenresFilm> {


    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER})
    filmId: number;

    @ForeignKey(() => Countries)
    @Column({type: DataType.INTEGER})
    genreId: number;

}