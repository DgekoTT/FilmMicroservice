
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
        const results = await this.countriesRepository.findAll({
            where: {
                name: { [Op.in]: countries },
            },
        });
        return this.CountriesCache(results)
    }


    async getCountryId(country: string): Promise<Countries | any> {

        const cacheKey = `getCountryId:${country}`;

        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        const resultFromDB = await this.getFromDbCountry(country);

        if (resultFromDB) {
            await this.cacheManager.set(cacheKey, resultFromDB);
        }

        return resultFromDB;
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


    private async CountriesCache(results: Countries[]) {
        // Кэширование результатов запроса на уровне отдельных стран
        const cachedResults: Countries[] = [];
        for (const country of results) {
            const cachedResult = await this.cacheManager.wrap(`getCountry:${country.name}`, async () => country);
            cachedResults.push(cachedResult);
        }
        return cachedResults;
    }

    async getFromDbCountry(country: string): Promise<Countries | any> {
        return await this.countriesRepository.findOne({
            where: {
                name: country,
            },
        });
    }
}
