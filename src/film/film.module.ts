
import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Film} from "./film.model";
import {Countries} from "../countries/countries.model";
import {Genres} from "../genre/genre.model";
import {GenreModule} from "../genre/genre.module";
import {CountriesModule} from "../countries/countries.module";
import {GenresFilm} from "./film-genres.model";
import {CountriesFilm} from "./film-countries.model";



@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports: [SequelizeModule.forFeature([Film, Countries, Genres, GenresFilm, CountriesFilm]),
    GenreModule,
    CountriesModule,
  ],
  exports: [
      FilmService
  ]
})
export class FilmModule {}
