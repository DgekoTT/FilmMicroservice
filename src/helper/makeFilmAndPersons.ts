import {FilmAndPersonsInfo} from "../interfaces/film.interfacs";

export class Helper {
     makeFilmAndPersonsInfo(film, persons) : FilmAndPersonsInfo {
        return {
            id: film.id,
            name: film.name,
            nameEn: film.nameEn,
            type: film.type,
            image: film.image,
            ratingVoteCount: film.ratingVoteCount,
            rating: film.rating,
            filmLength: film.filmLength,
            year: film.year,
            filmDescription: film.filmDescription,
            filmSpId: film.filmSpId,
            countries: film.countries,
            genre: film.genre,
            director: persons?.director,
            scenario: persons?.scenario,
            producer: persons?.producer,
            operator: persons?.operator,
            composer: persons?.composer,
            painter: persons?.painter,
            installation: persons?.installation,
            actors: persons?.actors,
        }
    }
}