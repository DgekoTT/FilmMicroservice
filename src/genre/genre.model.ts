import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Film} from "../film/film.model";
import {GenresFilm} from "../film/film-genres.model";
import {ApiProperty} from "@nestjs/swagger";
import {GenresCreationAttrs} from "../interfaces/genre.interfaces";





@Table({tableName: 'genres'})//появится таблица с именем genres
export class Genres extends Model<GenresCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
        //получим id как число, уникальное автозаполнение 1..2..3
    id: number;

    @ApiProperty({example: 'Комедия', description: 'название жанра'})
    @Column({type: DataType.STRING})
    nameRu: string;

    @ApiProperty({example: 'Comedy', description: 'название жанра'})
    @Column({type: DataType.STRING})
    nameEn: string;

    @ApiProperty({example: [1, 2], description: 'FK из таблицы GenresFilm,', isArray: true})
    @BelongsToMany(()=> Film, ()=> GenresFilm)
    films: Film[];

}