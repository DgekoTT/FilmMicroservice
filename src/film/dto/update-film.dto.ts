import {IsString} from "class-validator";

export class UpdateFilmDto {
    id: number
    @IsString({message: " Должно быть строкой"})
    name: string;
    @IsString({message: " Должно быть строкой"})
    nameEn: string;
}