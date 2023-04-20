import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Film} from "../film/film.model";
import {GenresFilm} from "../film/film-genres.model";



interface GenresCreationAttrs {
    id: number;
    name: string;
}

@Table({tableName: 'genres'})//появится таблица с именем countries
export class Genres extends Model<GenresCreationAttrs> {

    // появятся указанные колонки
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @BelongsToMany(()=> Film, ()=> GenresFilm)
    films: Film[];

}