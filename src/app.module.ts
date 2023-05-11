import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {FilmModule} from "./film/film.module";
import {CountriesModule} from "./countries/countries.module";
import {GenreModule} from "./genre/genre.module";
import {Film} from "./film/film.model";
import {Countries} from "./countries/countries.model";
import {Genres} from "./genre/genre.model";
import {GenresFilm} from "./film/film-genres.model";
import {CountriesFilm} from "./film/film-countries.model";
import {HttpModule} from "@nestjs/axios";


@Module({
  imports: [
      HttpModule.register({
        baseURL: 'http://localhost:5000',
        timeout: 5000, // время ожидания ответа
        headers: { 'Access-Control-Allow-Origin': '*' }, // разрешить CORS для всех источников
  }),
      // что бы нест всю конфигурацию считывал
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`   /*получаем конфигурации
         для разработки и для продакшена, нужно npm i cross-env*/
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Film, Countries, Genres, GenresFilm, CountriesFilm],
      autoLoadModels: true,
      logging: true
    }),
    FilmModule,
    CountriesModule,
    GenreModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
