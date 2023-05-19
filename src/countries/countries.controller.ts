
import {

    Controller, Post, UseGuards,

} from '@nestjs/common';
import {CountriesService} from "./countries.service";
import {Roles} from "../Guards/roles-auth.decorator";
import {RolesGuard} from "../Guards/role.guard";

@Controller('countries')
export class CountriesController {


    constructor(private countriesService: CountriesService) {}

    @Roles("admin")
    @UseGuards(RolesGuard) // проверка на роли, получить доступ сможет только админ
    @Post('/load')
    loadCountries(): Promise<string> {
        return this.countriesService.loadCountries();
    }

}
