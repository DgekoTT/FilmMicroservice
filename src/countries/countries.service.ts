
import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import sequelize, {Op} from "sequelize";
import {Countries} from "./countries.model";
import * as fs from "fs";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {CountriesFilm} from "../film/film-countries.model";


function InjectCache() {

}

@Injectable()
export class CountriesService {

    constructor(@InjectModel(Countries) private countriesRepository: typeof Countries,
                @InjectModel(CountriesFilm) private repositoryCountriesFilm: typeof CountriesFilm,
                @Inject(CACHE_MANAGER) private cacheManager: Cache) {}


    async getCountries(countries: string[]): Promise<Countries[]> {
        countries = countries.map((el) => el.trim());
        const results = await this.countriesRepository.findAll({
            where: {
                nameRu: { [Op.in]: countries },
            },
        });
        return this.CountriesCache(results)
    }


    // async getCountryId(country: string): Promise<Countries | any> {
    //
    //     const cacheKey = `getCountryId:${country}`;
    //
    //     const cachedResult = await this.cacheManager.get(cacheKey);
    //     if (cachedResult) {
    //         return cachedResult;
    //     }
    //
    //     const resultFromDB = await this.getFromDbCountry(country);
    //
    //     if (resultFromDB) {
    //         await this.cacheManager.set(cacheKey, resultFromDB);
    //     }
    //
    //     return resultFromDB;
    // }


    //загружаем страны из файла в базу
    async loadCountries(): Promise<string> {
        try {
            let data = fs.readFileSync('./src/countries/countries.txt', 'utf8').split('\n');
            let countries = data.map(el =>{
                let names = el.split('\t')
                return {nameRu: `${names[0].trim()}`, nameEn: `${names[1].trim()}`}
                });
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
            const cachedResult = await this.cacheManager.wrap(`getCountry:${country.nameRu}`, async () => country);
            cachedResults.push(cachedResult);
        }
        return cachedResults;
    }

    async getFromDbCountry(country: string): Promise<Countries | any> {
        return await this.countriesRepository.findOne({
            where: {
                nameRu: country,
            },
        });
    }

    async getFilmIds(countries: string) : Promise<number[]> {
        const  countryIds: number[] = await this.getCountryId(countries);

        const filmsGenre: any[] = await this.repositoryCountriesFilm.findAll({
            attributes: ['filmId'],
            where: {
                countryId: {
                    [Op.in]: countryIds
                }
            },
            group: ['filmId'],
            having: sequelize.literal(`COUNT(DISTINCT CASE WHEN "countryId" IN (${countryIds.join(',')}) THEN "countryId" END) = ${countryIds.length}`)
        });

        return filmsGenre.map((el) => el.filmId);
    }


    async getCountryId(countriesName: string): Promise<number[]> {
        const countries =  await this.countriesRepository.findAll({
            where: {
                [Op.or]: countriesName.split(',').map((country) => ({
                    nameEn: country
                }))
            }
        })
        return countries.map(el => el.id);
    }
}
