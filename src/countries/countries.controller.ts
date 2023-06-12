
import {

    Controller, Get, Post, UseGuards,

} from '@nestjs/common';
import {CountriesService} from "./countries.service";
import {Roles} from "../Guards/roles-auth.decorator";
import {RolesGuard} from "../Guards/role.guard";
import {ApiCookieAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Genres} from "../genre/genre.model";
import {Countries} from "./countries.model";

@Controller('countries')
export class CountriesController {


    constructor(private countriesService: CountriesService) {}

    @ApiCookieAuth()
    @ApiOperation({summary: 'загружаем все страны из файла'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: String, isArray: false})
    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post('/load')
    loadCountries(): Promise<string> {
        return this.countriesService.loadCountries();
    }

    @ApiOperation({summary: 'получаем все страны'})
    @ApiResponse({status: 200, description: 'Успешный запрос', type: Genres, isArray: true})
    @Get()
    getAllCountries(): Promise<Countries[]> {
        return this.countriesService.getAllCountries();
    }
}
