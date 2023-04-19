import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Countries} from "./countries.model";



@Module({
  providers: [],
  controllers: [CountriesController],
  imports: [SequelizeModule.forFeature([Countries]),
  ],

})
export class CountriesModule {}
