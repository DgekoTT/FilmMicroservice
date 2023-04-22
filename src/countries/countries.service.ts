

import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";
import {Countries} from "./countries.model";
import fs from "fs";



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

    //загружаем страны из файла в базу
    async loadCountries(): Promise<string> {
        let countries = [];
        fs.readFile('countries.txt', 'utf8', (err, data) =>{
            if (err) throw err;
            countries = data.split('/n')
        })
        await this.countriesRepository.bulkCreate(countries);
        return `Страны загружены в базу данных`
    }



}
