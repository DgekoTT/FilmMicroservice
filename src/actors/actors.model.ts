import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Film} from "../film/film.model";
import {ActorsFilm} from "../film/film-actors.model";



interface ActorsCreationAttrs {
    id: number;
    name: string;
    nameEnglish: string;
}

@Table({tableName: 'actors'})//появится таблица с именем actors
export class Actors extends Model<ActorsCreationAttrs> {

    // появятся указанные колонки
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @Column({type: DataType.STRING})
    name: string;

    @Column({type: DataType.STRING})
    nameEnglish: string;

    @BelongsToMany(()=> Film, ()=> ActorsFilm)
    films: Film[];


}