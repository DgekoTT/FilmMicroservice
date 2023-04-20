import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import { Genres} from "./genre.model";



@Module({
  providers: [],
  controllers: [],
  imports: [SequelizeModule.forFeature([Genres]),
  ],

})
export class GenreModule {}
