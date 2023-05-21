import {IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateFilmDto {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @IsNumber({}, {message: " Должно быть числом"})
    id: number

    @ApiProperty({example: 'Мексика', description: 'название фильма на русском'})
    @IsString({message: " Должно быть строкой"})
    name: string;

    @ApiProperty({example: 'Mexico', description: 'название фильма на английском'})
    @IsString({message: " Должно быть строкой"})
    nameEn: string;
}