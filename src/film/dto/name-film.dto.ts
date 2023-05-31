import {IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class FilmNameDto {
    @ApiProperty({example: 'Ауд', description: 'название фильма на русском или его часть'})
    @IsString({message: " Должно быть строкой"})
    @IsOptional()
    name?: string;

    @ApiProperty({example: 'Aul', description: 'название фильма на английском или его часть'})
    @IsString({message: " Должно быть строкой"})
    @IsOptional()
    readonly nameEn?: string;
}