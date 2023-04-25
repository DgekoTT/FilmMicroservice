
import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";
import {Countries} from "./countries.model";
import * as fs from "fs";
import {Genres} from "../genre/genre.model";



@Injectable()
export class CountriesService {

    constructor(@InjectModel(Countries) private countriesRepository: typeof Countries) {}


    async getCountryId(country: string): Promise<Countries> {
        let countryObj = await this.countriesRepository.findOne({
            where: {
                name: {country}
            }
        })
        return countryObj;
    }

    //загружаем страны из файла в базу
    async loadCountries(): Promise<string> {
        try {
            let data = fs.readFileSync('G:/AA/FilmMicroservice1/src/countries/countries.txt', 'utf8').split('\n');
            let countries = data.map(el =>{ return {name: `${el.trim()}`}});
            let res = await this.countriesRepository.bulkCreate(countries);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
        return `Страны загружены в базу данных`
    }



}
