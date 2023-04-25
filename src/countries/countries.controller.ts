
import {

    Controller, Get, Param, Post,

} from '@nestjs/common';
import {CountriesService} from "./countries.service";
import {Countries} from "./countries.model";

@Controller('countries')
export class CountriesController {


    constructor(private countriesService: CountriesService) {}

    @Post('/load')
    loadCountries(): Promise<string> {
        return this.countriesService.loadCountries();
    }

}
