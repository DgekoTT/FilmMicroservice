
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




@Injectable()
export class FilmService {
    //что бы иметь доступ к базе, инжектим модель бд
    constructor(@InjectModel(Film) private filmRepository: typeof Film,
                private genreService: GenreService,
                private countriesService: CountriesService,
                @Inject("FILM_SERVICE") private readonly client: ClientProxy) {}

    async createFilm(dto: CreateFilmDto) {
        const newFilm = await this.filmRepository.create(dto);
        const countriesObj = await this.countriesService.getCountries(dto.countries.split(','))
        const countriesId = countriesObj.map(el => el.id);
        await newFilm.$set('countries', countriesId);
        const genreObj = await  this.genreService.getGenre(dto.genre.split(', '));
        const genresId = genreObj.map(el=> el.id);
        await newFilm.$set('genre', genresId);
        return newFilm;
    }

    async updateFilm(dto: UpdateFilmDto): Promise<string> {
    const film = this.checkerFilm(dto.id);
    await this.filmRepository.update(
        {name: dto.name, nameEn: dto.nameEn},
        {where: {id: dto.id}}
    )
        //не стал получать обновленный объект, что бы не терять производительность
    return `Название фильма обновлено на ${dto.name} ${dto.nameEn} `
    }

    async getFilmById(id: number): Promise<Film> {
        const film = await this.filmRepository.findOne({where: {id}, include: {all: true}});
        return film;

    }


    async checkerFilm(id: number ): Promise<Film> {
        const isFilm = await this.getFilmById(id);
        if (!isFilm) {
            throw new HttpException('Блок с данным id не найден', HttpStatus.NOT_FOUND)
        }
        return isFilm;
    }


    async getFilmByGenre(genre: string): Promise<Film[]> {
        const genreObj = await this.genreService.getGenreId(genre);
        const filmByGenre = await this.filmRepository.findAll({
            where: {
                // @ts-ignore
                genre: `${genreObj.id}`
            }
        });
        return filmByGenre;
    }

    async getFilmCountry(country: string): Promise<Film[]>  {
        const countryObj = await this.countriesService.getCountryId(country);
        const filmByCountry = await this.filmRepository.findAll({
            where: {
                // @ts-ignore
                countries: `${countryObj.id}`
            }
        });
        return filmByCountry;
    }

    async loadFilms(): Promise<string> {
        for (let i=0; i < 1; i++) {// Проходим по всем файлам в папке. Пока беру 1
            try{
                let data = fs.readFileSync('./src/film/filmData/filmsWithId0.json', 'utf8')
                let info = JSON.parse(data);
                await this.loadToBase(info);
            }catch (e) {
                console.log(e);
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
                let filmData = await this.filmRepository.create(film);
                await this.createPersons(film, filmData.id);
            }
        }
    }


    async makePersonDto(dto: any, id: number): Promise<any> {
        const persons = {
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
        return persons;
    }

    makeFilmInfo(film: Film) {
        const filmInfo = {
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
        }
        return filmInfo;
    }

    private makeFilmToLoad(el: any) {
        const film = {
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
            director: el.director,
            scenario: el.scenario,
            producer: el.producer,
            operator: el.operator,
            composer: el.composer,
            painter: el.painter,
            installation: el.installation,
            actors: el.main_role,
        }
        return film;
    }

    //создаем персон фильма, если микросервис персон не ответит, получим пустой массив
    async createPersons(dto: any, id: number) {
        const personDto = await this.makePersonDto(dto, id);
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000, []));
        const personsPromise = await firstValueFrom(this.client.send({cmd: 'createPersons'}, JSON.stringify(personDto)));
        let persons;
        try {
            persons = await Promise.race([personsPromise, timeoutPromise])
        } catch (err) {
            console.error(`Error while getting persons for film ${id}: ${err.message}`);
            persons = [];
        }
        return persons;
    }

    //получаем персон фильма, если микросервис персон не ответит, получим пустой массив
    async getPersons(id: number): Promise<any> {
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000, []));
        const personsPromise = firstValueFrom(this.client.send({ cmd: 'getPersons' }, id));
        let persons;
        try {
            persons = await Promise.race([personsPromise, timeoutPromise]);
        } catch (err) {
            console.error(`Error while getting persons for film ${id}: ${err.message}`);
            persons = [];
        }
        return persons;
    }
}
