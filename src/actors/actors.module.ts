import { Module } from '@nestjs/common';

import {SequelizeModule} from "@nestjs/sequelize";
import {ActorsController} from "./actors.controller";
import {Actors} from "./actors.model";
import {GenreModule} from "../genre/genre.module";
import {CountriesModule} from "../countries/countries.module";
import {ActorsService} from "./actors.service";
import {ActorsFilm} from "../film/film-actors.model";




@Module({
  providers: [ActorsService],
  controllers: [ActorsController],
  imports: [SequelizeModule.forFeature([Actors, ActorsFilm]),
  ],
  exports: [ActorsService]
})
export class ActorsModule {}
