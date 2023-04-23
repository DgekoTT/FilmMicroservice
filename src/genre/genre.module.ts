import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import { Genres} from "./genre.model";
import {GenreController} from "./genre.controller";
import {GenreService} from "./genre.service";
import {GenresFilm} from "../film/film-genres.model";



@Module({
  providers: [GenreService],
  controllers: [GenreController],
  imports: [SequelizeModule.forFeature([Genres, GenresFilm]),
  ],
  exports: [GenreService]
})
export class GenreModule {}
