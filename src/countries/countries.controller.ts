
import {

    Controller, Post, UseGuards,

} from '@nestjs/common';
import {CountriesService} from "./countries.service";
import {Roles} from "../Guards/roles-auth.decorator";
import {RolesGuard} from "../Guards/role.guard";
import {ApiCookieAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";

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
}
