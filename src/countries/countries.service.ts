
import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";
import {Countries} from "./countries.model";
import * as fs from "fs";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


function InjectCache() {

}

@Injectable()
export class CountriesService {

    constructor(@InjectModel(Countries) private countriesRepository: typeof Countries,
                @Inject(CACHE_MANAGER) private cacheManager: Cache) {}


    async getCountries(countries: string[]): Promise<Countries[]> {
        countries = countries.map((el) => el.trim());
        return await this.cacheManager.wrap('getCountries', async () => {
            return await this.countriesRepository.findAll({
                where: {
                    name: { [Op.in]: countries },
                },
            });
        });
    }


    async getCountryId(country: string): Promise<Countries> {
        return await this.cacheManager.wrap('getCountryId', async () => {
            return await this.countriesRepository.findOne({
                where: {
                    name: country ,
                },
            });
        });
    }


    //загружаем страны из файла в базу
    async loadCountries(): Promise<string> {
        try {
            let data = fs.readFileSync('./src/countries/countries.txt', 'utf8').split('\n');
            let countries = data.map(el =>{ return {name: `${el.trim()}`}});
            let res = await this.countriesRepository.bulkCreate(countries);
        } catch (err) {
            console.error(err);
            throw new HttpException('Ошибка загрузки', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return `Страны загружены в базу данных`
    }



}
