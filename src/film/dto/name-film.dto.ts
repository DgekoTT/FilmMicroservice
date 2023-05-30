import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class FilmNameDto {
    @ApiProperty({example: 'Ауд', description: 'название фильма на русском или его часть'})
    @IsString({message: " Должно быть строкой"})
    name: string;
}