
import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateFilmDto} from "./dto/create-film.dto";
import {Film} from "./film.model";
import {GenreService} from "../genre/genre.service";
import {CountriesService} from "../countries/countries.service";
import {UpdateFilmDto} from "./dto/update-film.dto";
import * as fs from "fs";
import {firstValueFrom} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";
import {Op} from "sequelize";
import {Actors, FilmInfo, Persons} from "../interfaces/film.interfacs";
import {Countries} from "../countries/countries.model";
import {Genres} from "../genre/genre.model";
import {CountriesFilm} from "./film-countries.model";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {GenresFilm} from "./film-genres.model";
import {FilterFilmDto} from "./dto/filter-film.dto";



@Injectable()
export class FilmService {
    //что бы иметь доступ к базе, инжектим модель бд
    constructor(@InjectModel(Film) private filmRepository: typeof Film,
                @InjectModel(CountriesFilm) private repositoryCountriesFilm: typeof CountriesFilm,
                @InjectModel(GenresFilm) private repositoryGenresFilm: typeof GenresFilm,
                private genreService: GenreService,
                private countriesService: CountriesService,
                @Inject(CACHE_MANAGER) private cacheManager: Cache,
                @Inject("FILM_SERVICE") private readonly client: ClientProxy) {}


    async getRandom30(): Promise<FilmInfo[]>  {
        const  nums = this.getRandomNums();
        const films =  await this.getFilmsByIds(nums);
        return films.map(film => this.makeFilmInfo(film))

    }

    getRandomNums(): number[] {
        const num  = [];
        for (let s = 0; s < 31; s++) {
            num.push(Math.floor(Math.random() * (1910 - 1 + 1)) +1)
        }
        return num;
    }


    async createFilm(dto: CreateFilmDto): Promise<Film> {
        const newFilm = await this.filmRepository.create(dto);
        await this.addCountries(dto.countries, newFilm)
        await this.addGenres(dto.genre, newFilm)
        return newFilm;
    }

    async updateFilm(dto: UpdateFilmDto): Promise<string> {
    const film = this.getFilmById(dto.id);
    await this.filmRepository.update(
        {name: dto.name, nameEn: dto.nameEn},
        {where: {id: dto.id}}
    )
        //не стал получать обновленный объект, что бы не терять производительность
    return `Название фильма обновлено на ${dto.name} ${dto.nameEn} `
    }

    async getFilmById(id: number): Promise<Film> {
        const film =  await this.filmRepository.findOne({where: {id}, include: {all: true}});
        await this.checkerFilm(film)
        return film;
    }


    async checkerFilm(film: Film ): Promise<void>{
        if (!film) {
            throw new HttpException('Фильм с данным id не найден', HttpStatus.NOT_FOUND)
        }
    }


    async getFilmByGenre(genre: string[]){
        const genreObj = await this.genreService.getGenreId(genre);
        const genreId = genreObj.map(el => el.id)

        const cacheKey = `getFilmCountry:${genreObj.join()}`;
        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        const id = await this.getFilmIdsByGenre(genreId);
        const films = await this.getFilmsByIds(id);
        const filmInfo = films.map(film => this.makeFilmInfo(film))


        await this.cacheManager.set(cacheKey, filmInfo);

        return filmInfo;

    }


    async getFilmCountry(country: string) {
        const countryObj = await this.countriesService.getCountryId(country);
        if (!countryObj) {
            throw new HttpException('этой страны нет в базе', HttpStatus.NOT_FOUND);
        }

        const cacheKey = `getFilmCountry:${countryObj.id}`;
        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        const id = await this.getFilmIdsByCountry(countryObj.id);
        const films = await this.getFilmsByIds(id);

        await this.cacheManager.set(cacheKey, films);

        return films;
    }

    async getFilmIdsByCountry(countryId: number): Promise<number[]> {
        const arrayId = await this.repositoryCountriesFilm.findAll({
            where: {
                countryId
            }
        });

        return arrayId.map(el => el.filmId);
    }

    async getFilmsByIds(ids: number[]): Promise<Film[]> {
        return await this.filmRepository.findAll({
            where: {
                id: {[Op.in]: ids}
            },
            include: {all: true}
        });
    }

    async loadFilms(): Promise<string> {
        for (let i=0; i < 21; i++) {// Проходим по всем файлам в папке
            try{
                let data = fs.readFileSync(`./src/film/filmData/filmsWithId${i}New.json`, 'utf8')
                let info = JSON.parse(data);
                await this.loadToBase(info);
            }catch (e) {
                console.log(e);
                throw new HttpException("ошибка загрузки", HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
        return `successes`;
    }

    async loadToBase(info: any) {
        let filmSpId = [];
        for (let el of info) {
            let film = this.makeFilmToLoad(el)
            if(!filmSpId.includes(film.filmSpId)) {
                filmSpId.push(film.filmSpId);
                let filmData = await this.createFilm(film);
                // await this.createPersons(film, filmData.id);
            }
        }
    }


    async makePersonDto(dto: any, id: number): Promise<Persons> {
       return  {
            filmId: id,
            director: dto.director,
            scenario: dto.scenario,
            producer: dto.producer,
            operator: dto.operator,
            composer: dto.composer,
            painter: dto.painter,
            installation: dto.installation,
            actors: dto.actors
        }
    }

    makeFilmInfo(film: Film): FilmInfo {
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
            countries: this.makeCountries(film.countries),
            genre: this.makeGenres(film.genre),
        }
    }

    private makeFilmToLoad(el: any) {
        const actors = (el.main_role)? this.makeActors(el.main_role) : el.main_role;
        return  {
            name: el.title_ru,
            nameEn: el.title_en,
            type: el.type,
            image: el.poster_film_small,
            ratingVoteCount: el.ratingKinopoiskVoteCount,
            rating: +el.rating,
            filmLength: el.duration,
            year: +el.year,
            filmDescription: el.description,
            filmSpId: +el.filmId,
            countries: el.country,
            genre: el.genre,
            director: el.director,
            scenario: el.scenario,
            producer: el.producer,
            operator: el.operator,
            composer: el.composer,
            painter: el.painter,
            installation: el.installation,
            actors: actors,
        }
    }

    //создаем персон фильма, если микросервис персон не ответит, получим пустой массив
    async createPersons(dto: any, id: number): Promise<Persons>  {
        const personDto: Persons = await this.makePersonDto(dto, id);
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000, []));
        const personsPromise = await firstValueFrom(this.client.send({cmd: 'createPersons'}, JSON.stringify(personDto)));
        let persons;
        try {
            persons = await Promise.race([personsPromise, timeoutPromise])
        } catch (err) {
            console.error(`Ошибки при получении персон для филма ${id}: ${err.message}`);
            persons = [];
        }
        return persons;
    }

    //получаем персон фильма, если микросервис персон не ответит, получим пустой массив
    async getPersons(id: number): Promise<Persons> {
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000, []));
        const personsPromise = firstValueFrom(this.client.send({ cmd: 'getPersons' }, id));
        let persons;
        try {
            persons = await Promise.race([personsPromise, timeoutPromise]);
        } catch (err) {
            console.error(`Ошибки при получении персон для филма ${id}: ${err.message}`);
            persons = [];
        }
        return persons;
    }

    async getFilmByRating(rating: number): Promise<Film[]> {
        return await this.filmRepository.findAll({where: {
            rating: {
                [Op.gt]: rating
            }
            }})
    }

    async getFilmByRatingVoteCount(amount: number): Promise<Film[]>  {
       return await this.filmRepository.findAll({where: {
                ratingVoteCount: {
                    [Op.gt]: amount
                }
            }})
    }

    async getSortedFilms(sortBy: string[], sortOrder: string): Promise<Film[]> {
        let sortClause = [];
        if (sortBy.includes('rating')) {
            sortClause.push(['rating', sortOrder]);
        }
        if (sortBy.includes('ratingVoteCount')) {
            sortClause.push(['ratingVoteCount', sortOrder]);
        }
        if (sortBy.includes('year')) {
            sortClause.push(['year', sortOrder]);
        }
        if (sortBy.includes('name')) {
            sortClause.push(['name', sortOrder]);
        }
       return await this.filmRepository.findAll({order: sortClause});
    }

    async getFilmBySpId(SpId: number): Promise<Film> {
        const film =  await this.filmRepository.findOne({where: {
                filmSpId: SpId
            }, include: {all: true}});
        await this.checkerFilm(film)
        return film;
    }


    private makeActors(main_role: Record<number, string>): Actors[]{
        let actors = [];
        for (let[key, value] of Object.entries(main_role)) {
            actors.push({
                id: key,
                name: value
            })
        }
        return actors;
    }

    private makeCountries(countries: Countries[]): string[] {
        return countries.map(country => country.nameRu);
    }

    private makeGenres(genre: Genres[]): string[]  {
        return genre.map(genres => genres.nameRu);
    }

    private async addGenres(genre: string, newFilm: Film) {
        const genreObj = (genre) ? await  this.genreService.getGenre(genre.split(', ')) : null;
        const genresId = genreObj?.map(el => el.id) || null;
        await newFilm.$set('genre', genresId);
    }

    private async addCountries(countries: string, newFilm: Film) {
        const countriesObj = (countries) ? await this.countriesService.getCountries(countries.split(',')) : null;
        const countriesId = countriesObj?.map(el => el.id) || null;
        await newFilm.$set('countries', countriesId);
    }

    private async getFilmIdsByGenre(id: number[]) {
      const genresFilm = await this.repositoryGenresFilm.findAll({where: {
              genreId: {[Op.in] : id}
            }})
        return genresFilm.map(el => el.filmId);
    }

    async getFilmsByFilters(filters: FilterFilmDto) {
        const query: any = {};

        if (filters.type) {
            query.type = filters.type;
        }

        if (filters.genre) {
            query.genre = {
                [Op.in]: filters.genre,
            };
        }

        if (filters.rating) {
            query.rating = filters.rating;
        }

        if (filters.countries) {
            query['$countries.name$'] = {
                [Op.in]: filters.countries,
            };
        }

        if (filters.ratingVoteCount) {
            query.ratingVoteCount = filters.ratingVoteCount;
        }

        if (filters.filmLength) {
            query.filmLength = filters.filmLength;
        }

        if (filters.year) {
            query.year = filters.year;
        }

        if (filters.director) {
            query.director = filters.director;
        }

        if (filters.actor) {
            query['$actors.name$'] = filters.actor;
        }

        const films = await this.filmRepository.findAll({
            where: query,
            // include: [
            //     { model: Countries, as: 'countries' },
            //     { model: Actors, as: 'actors' },
            // ],
        });

        return films;
    }
}


