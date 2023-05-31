import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString} from "class-validator";

export interface Actors {
    id: number,
    name: string
}

export interface FilmInfo {
    id: number,
    name: string,
    nameEn: string,
    type: string,
    image: string,
    ratingVoteCount: number,
    rating: number,
    filmLength: string,
    year: number,
    filmDescription: string,
    filmSpId: number,
    countries: string[],
    genre: string[],
}

export interface Persons  {
    filmId: number,
    director: string,
    scenario: string,
    producer: string,
    operator: string,
    composer:string,
    painter: string,
    installation: string,
    actors: Actors,
}

export interface FilmAndPersonsInfo {
    id: number,
    name: string,
    nameEn: string,
    type: string,
    image: string,
    ratingVoteCount: number,
    rating: number,
    filmLength: string,
    year: number,
    filmDescription: string,
    filmSpId: number,
    countries: string[],
    genre: string[],
    director: string,
    scenario: string,
    producer: string,
    operator: string,
    composer:string,
    painter: string,
    installation: string,
    actors: Actors,
}

export interface FilmCreationAttrs {
    id: number;
    name: string;
    nameEn: string;
    type: string;// фильм, сериал или мультфильм
    image: string;// ссылка с кинопоиска на постер фильма
    ratingVoteCount: number;
    rating: number;
    filmLength: string;// продолжительность
    year: number;
    filmDescription: string;
    filmSpId: number;
}

export interface FilterQuery {

    type?: string;
    genre?: string;
    rating?: number;
    countries?: string;
    ratingVoteCount?: number;
    filmLength?: string;
    year?: number;
    director?: string;
    actor?: string;
    orderBy?: string
    orderDirection?: string

}

export interface FilmToLoad {

}