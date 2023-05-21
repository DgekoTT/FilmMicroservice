import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CountryFilmDto {
    @ApiProperty({example: 'Китай', description: 'название страны'})
    @IsString({message: " Должно быть строкой"})
    name: string;
}