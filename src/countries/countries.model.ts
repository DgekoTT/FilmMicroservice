import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Film} from "../film/film.model";
import {CountriesFilm} from "../film/film-countries.model";


interface CountriesCreationAttrs {
    id: number;
    name: string;
}

@Table({tableName: 'countries'})//появится таблица с именем countries
export class Countries extends Model<CountriesCreationAttrs> {

    // появятся указанные колонки
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @Column({type: DataType.STRING})
    name: string;

    @BelongsToMany(()=> Film, ()=> CountriesFilm)
    films: Film[];


}