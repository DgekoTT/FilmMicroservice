
import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Film} from "./film.model";
import {Actors} from "../actors/actors.model";
import {Countries} from "../countries/countries.model";
import {Genres} from "../genre/genre.model";
import {GenreModule} from "../genre/genre.module";
import {CountriesModule} from "../countries/countries.module";
import {ActorsModule} from "../actors/actors.module";
import {GenresFilm} from "./film-genres.model";
import {CountriesFilm} from "./film-countries.model";
import {ActorsFilm} from "./film-actors.model";


@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports: [SequelizeModule.forFeature([Film, Actors, Countries, Genres, GenresFilm, CountriesFilm, ActorsFilm]),
    ActorsModule,
    GenreModule,
    CountriesModule,
  ],
  exports: [
      FilmService
  ]
})
export class FilmModule {}
