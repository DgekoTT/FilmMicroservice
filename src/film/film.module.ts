
import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Film} from "./film.model";


@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports: [SequelizeModule.forFeature([Film]),

  ],
  exports: [
      FilmService
  ]
})
export class FilmModule {}
