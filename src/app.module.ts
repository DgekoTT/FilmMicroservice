import { Module } from '@nestjs/common';
import path from "path";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {FilmModule} from "./film/film.module";
import {ActorsModule} from "./actors/actors.module";
import {CountriesModule} from "./countries/countries.module";
import {GenreModule} from "./genre/genre.module";
import {Film} from "./film/film.model";
import {Actors} from "./actors/actors.model";
import {Countries} from "./countries/countries.model";
import {Genres} from "./genre/genre.model";
import {GenresFilm} from "./film/film-genres.model";
import {CountriesFilm} from "./film/film-countries.model";
import {ActorsFilm} from "./film/film-actors.model";

@Module({
  imports: [      // что бы нест всю конфигурацию считывал
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
      models: [Film, Actors, Countries, Genres, GenresFilm, CountriesFilm, ActorsFilm],
      autoLoadModels: true,
      logging: true
    }),
    FilmModule,
    ActorsModule,
    CountriesModule,
    GenreModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
