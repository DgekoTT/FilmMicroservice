

import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";
import {Countries} from "./countries.model";



@Injectable()
export class CountriesService {

    constructor(@InjectModel(Countries) private countriesRepository: typeof Countries) {}

    async createCountries() {
        /*bulkCreate() нужно передать массив с объектами и за 1
        раз создаст всу объекты в бд
         */
        // const actor = await this.countriesRepository.bulkCreate();
        // return actor;
    }

    async getCountries(countries: string[]): Promise<Countries[]>{
        let countriesInDb = await this.countriesRepository.findAll({
            where: {
                name: { [Op.in]: countries }
            }
        })
        return countriesInDb;
    }



}
