
import {Module} from '@nestjs/common';
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
import {ClientsModule, Transport} from "@nestjs/microservices";
import {JwtModule} from "@nestjs/jwt";
import {Helper} from "../helper/makeFilmAndPersons";
import {CacheModule} from "@nestjs/cache-manager";



@Module({
  providers: [FilmService, Helper],
  controllers: [FilmController],
  imports: [ JwtModule.register({
    secret: "FFFGKJKFWMV",
    signOptions: {//время жизни токена
      expiresIn: '24h'
    }}),
      ClientsModule.register([
        {
          name: 'FILM_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://rabbitmq:5672`],//localhost
            queue: 'films_queue',
            queueOptions: {
              durable: false
            },

          },
        },
    ]),
    SequelizeModule.forFeature([Film, Countries, Genres, GenresFilm, CountriesFilm]),
    GenreModule,
    CountriesModule,
    JwtModule,
    CacheModule.register()
  ],
  exports: [
      FilmService
  ]
})
export class FilmModule {}
