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