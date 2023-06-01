
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
import {Actors, FilmInfo, FilterQuery, Persons} from "../interfaces/film.interfacs";
import {Countries} from "../countries/countries.model";
import {Genres} from "../genre/genre.model";
import {CountriesFilm} from "./film-countries.model";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {GenresFilm} from "./film-genres.model";
import {FilterFilmDto} from "./dto/filter-film.dto";
import {FilmNameDto} from "./dto/name-film.dto";



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
        const cacheKey = `getFilmById:${id}`;
        const cachedFilm = await this.cacheManager.get<Film>(cacheKey);
      
        if (cachedFilm) {
          return cachedFilm;
        }
      
        const film = await this.filmRepository.findOne({
          where: { id },
          include: { all: true },
        });
      
        await this.checkerFilm(film);
      
        await this.cacheManager.set(cacheKey, film);
      
        return film;
    }


    async checkerFilm(film: Film ): Promise<void>{
        if (!film) {
            throw new HttpException('Фильм с данным id не найден', HttpStatus.NOT_FOUND)
        }
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
        for (let i=0; i < 28 ; i++) {// Проходим по всем файлам в папке
            try{
                let data = fs.readFileSync(`./src/film/filmData/filmsWithId${i}New.json`, 'utf8')
                let info = JSON.parse(data);
                await this.loadToBase(info);
            }catch (e) {
                console.log(e);
                throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
        return `successes`;
    }

    async loadToBase(info: any) : Promise<void>  {
        let filmSpId = [];
        for (let el of info) {
            let film = this.makeFilmToLoad(el)
            if(!filmSpId.includes(film.filmSpId)) {
                if (!film.filmSpId || isNaN(film.filmSpId)) {continue;}
                filmSpId.push(film.filmSpId);
                let filmData = await this.createFilm(film);
                console.log(filmData.id)
                await this.createPersons(film, filmData.id);
            }
        }
    }


    async makePersonDto(dto: any, id: number): Promise<Persons> {
        let actors = dto.actors ? dto.actors.map(el => el.name) : null
        return  {
            filmId: id,
            director: dto.director,
            scenario: dto.scenario,
            producer: dto.producer,
            operator: dto.operator,
            composer: dto.composer,
            painter: dto.painter,
            installation: dto.installation,
            actors: actors
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
        console.log(persons)
        return persons;
    }



    async getFilmBySpId(SpId: number): Promise<Film> {
        const cacheKey = `getFilmBySpId:${SpId}`;
        const cachedFilm = await this.cacheManager.get<Film>(cacheKey);
      
        if (cachedFilm) {
          return cachedFilm;
        }
      
        const film = await this.filmRepository.findOne({
          where: { filmSpId: SpId },
          include: { all: true },
        });
      
        await this.checkerFilm(film);
      
        await this.cacheManager.set(cacheKey, film);
      
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

    private async addGenres(genre: string, newFilm: Film) : Promise<void>  {
        const genreObj = (genre) ? await  this.genreService.getGenre(genre.split(', ')) : null;
        const genresId = genreObj?.map(el => el.id) || null;
        await newFilm.$set('genre', genresId);
    }

    private async addCountries(countries: string, newFilm: Film) : Promise<void> {
        const countriesObj = (countries) ? await this.countriesService.getCountries(countries.split(',')) : null;
        const countriesId = countriesObj?.map(el => el.id) || null;
        await newFilm.$set('countries', countriesId);
    }



    async getFilmsByFilters(filters: FilterFilmDto) : Promise<FilmInfo[] | {message: string}>         {
        const query: any = await this.makeQueryFilters(filters);

        if (!query || Object.keys(query).length === 0) {
          return { message: 'Фильмов по вашему запросу не найдено' };
        }
      
        const cacheKey = `getFilmsByFilters:${JSON.stringify(query)}:${filters.orderBy}:${filters.orderDirection}`;
        const cachedFilmInfo = await this.cacheManager.get<FilmInfo[]>(cacheKey);
      
        if (cachedFilmInfo) return cachedFilmInfo;
        
        const orderBy = filters.orderBy || Object.keys(query)[0];
        const orderDirection = filters.orderDirection || 'ASC';
      
        const films = await this.filmRepository.findAll({
          where: query,
          order: [[orderBy, orderDirection]],
          include: { all: true },
        });
      
        const filmInfo = films.map(film => this.makeFilmInfo(film));
      
        await this.cacheManager.set(cacheKey, filmInfo);
      
        return filmInfo;
    }

    private async getIdByDirectorOrActor(director: string, actor: string) : Promise<number[] | []> {
        const directorName = director ? decodeURIComponent(director) : null;
        const actorName = actor ? decodeURIComponent(actor) : null;

        let filmIds = await firstValueFrom(this.client.send({cmd: 'Find film id by actor or director'},
            JSON.stringify({director: directorName, actor: actorName})));

        if (filmIds.length > 0) {
            return  filmIds;

        } else {
            // Если нет фильмов, соответствующих режиссеру и актеру пустой массив
            return [];
        }
    }

    private async makeQueryFilters(filters: FilterFilmDto): Promise<FilterQuery> {
        let id: any = []
        let query: any = {};

        if (filters.type) {
            query.type = filters.type;
        }

        if (filters.genre) {
            const filmIdByGenre =  await this.genreService.getFilmIds(filters.genre)
            id = this.filterIds(filmIdByGenre, id)
        }

        if (filters.rating) {
            query.rating = filters.rating;
        }

        if (filters.countries) {
            const filmIdByCountry =  await this.countriesService.getFilmIds(filters.countries)
            id = this.filterIds(filmIdByCountry, id)
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

        if (filters.director || filters.actor) {
            const filmIdByPersons =  await this.getIdByDirectorOrActor(filters.director, filters.actor)
            id = this.filterIds(filmIdByPersons, id)
            }
        
        if (id){
            query.id = {[Op.in] : id} 
        }

        return query;
    }    


    filterIds(newIds: number[], id: number[]) : number[] {
        if(!id?.length){ return newIds}
        return id.filter((item) => newIds.includes(item));
    }
    
    async getFilmsByName(name: FilmNameDto) : Promise<FilmInfo[]> {
        const whereOption = name.nameEn ? {nameEn: {[Op.like]: `%${name.nameEn}%`}} : {name: {[Op.like]: `%${decodeURI(name.name)}%`}}
   
        const cacheKey = `getFilmsByName:${JSON.stringify(whereOption)}`;
        const cachedFilmInfo = await this.cacheManager.get<FilmInfo[]>(cacheKey);
      
        if (cachedFilmInfo)  return cachedFilmInfo;
        
        const films = await this.filmRepository.findAll({
          where: whereOption,
          limit: 10,
          include: { all: true },
        });
      
        const filmInfo = films.map(film => this.makeFilmInfo(film));
      
        await this.cacheManager.set(cacheKey, filmInfo);
      
        return filmInfo;
    }
}


