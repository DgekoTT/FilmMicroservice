import { Module } from '@nestjs/common';

import {SequelizeModule} from "@nestjs/sequelize";
import {ActorsController} from "./actors.controller";
import {Actors} from "./actors.model";




@Module({
  providers: [],
  controllers: [ActorsController],
  imports: [SequelizeModule.forFeature([Actors]),
  ],

})
export class ActorsModule {}
