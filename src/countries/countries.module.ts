import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Countries} from "./countries.model";
import {CountriesService} from "./countries.service";
import {CountriesController} from "./countries.controller";
import {CountriesFilm} from "../film/film-countries.model";
import {JwtModule} from "@nestjs/jwt";



@Module({
  providers: [CountriesService],
  controllers: [CountriesController],
  imports: [SequelizeModule.forFeature([Countries, CountriesFilm]),
      JwtModule,
  ],
  exports: [CountriesService]
})
export class CountriesModule {}
