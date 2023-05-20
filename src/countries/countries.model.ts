import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Film} from "../film/film.model";
import {CountriesFilm} from "../film/film-countries.model";
import {ApiProperty} from "@nestjs/swagger";


interface CountriesCreationAttrs {
    id: number;
    name: string;
}

@Table({tableName: 'countries'})//появится таблица с именем countries
export class Countries extends Model<CountriesCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @ApiProperty({example: 'Мексика', description: 'название страны'})
    @Column({type: DataType.STRING})
    name: string;

    @ApiProperty({example: [1, 2], description: 'FK фильмов из таблицы CountriesFilm,', isArray: true})
    @BelongsToMany(()=> Film, ()=> CountriesFilm)
    films: Film[];


}