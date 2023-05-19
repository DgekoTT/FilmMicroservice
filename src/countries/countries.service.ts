
import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";
import {Countries} from "./countries.model";
import * as fs from "fs";




@Injectable()
export class CountriesService {

    constructor(@InjectModel(Countries) private countriesRepository: typeof Countries) {}

    async getCountries(countries: string[]): Promise<Countries[]>{
        countries = countries.map(el => el.trim());
        return await this.countriesRepository.findAll({
            where: {
                name: { [Op.in]: countries }
            }
        })
    }

    async getCountryId(country: string): Promise<Countries> {
       return  await this.countriesRepository.findOne({
            where: {
                name: {country}
            }
        })
    }

    //загружаем страны из файла в базу
    async loadCountries(): Promise<string> {
        try {
            let data = fs.readFileSync('./src/countries/countries.txt', 'utf8').split('\n');
            let countries = data.map(el =>{ return {name: `${el.trim()}`}});
            let res = await this.countriesRepository.bulkCreate(countries);
        } catch (err) {
            console.error(err);
        }
        return `Страны загружены в базу данных`
    }



}
