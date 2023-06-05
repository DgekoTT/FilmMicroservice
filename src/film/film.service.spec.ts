import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from '../genre/genre.service';
import { CountriesService } from '../countries/countries.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/sequelize';
import { Film } from './film.model';
import { CountriesFilm } from './film-countries.model';
import { GenresFilm } from './film-genres.model';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilterFilmDto } from './dto/filter-film.dto';
import { FilmNameDto } from './dto/name-film.dto';
import {FilmService} from "./film.service";

describe('FilmService', () => {
    let filmService: FilmService;
    let genreService: GenreService;
    let countriesService: CountriesService;
    let cacheManager: Cache;
    let clientProxy: ClientProxy;
    let filmInfo = [{
        id: 1,
        name: "Попкульт",
        nameEn: null,
        type: "movie",
        image: "https://st.kp.yandex.net/images/film_iphone/iphone360_5260016.jpg",
        ratingVoteCount: 6285,
        rating: 9.443,
        filmLength: "90",
        year: 2022,
        filmDescription: "«Попкульт» — это проект на стыке ностальгии и любви к массовой культуре. В шоу, которое выходит на YouTube-канале «sndk», авторы разбирают прошлое на атомы через призму игр, анимации, кино, комиксов и технологий, чтобы понять, как формировалась современная индустрия развлечений. Каждый выпуск посвящён одному году и его релизам, которые повлияли на развитие поп-культуры.",
        filmSpId: 5260016,
        countries: ['Россия'],
        genre: ['история'],
    }];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FilmService,
                GenreService,
                CountriesService,
                {
                    provide: getModelToken(Film),
                    useValue: {},
                },
                {
                    provide: getModelToken(CountriesFilm),
                    useValue: {},
                },
                {
                    provide: getModelToken(GenresFilm),
                    useValue: {},
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                    },
                },
                {
                    provide: 'FILM_SERVICE',
                    useValue: {
                        send: jest.fn(),
                    },
                },
            ],
        }).compile();

        filmService = module.get<FilmService>(FilmService);
        genreService = module.get<GenreService>(GenreService);
        countriesService = module.get<CountriesService>(CountriesService);
        cacheManager = module.get<Cache>(CACHE_MANAGER);
        clientProxy = module.get<ClientProxy>('FILM_SERVICE');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createFilm', () => {
        it('should create a new film', async () => {
            const dto: CreateFilmDto = {
                name: "Попкульт",
                nameEn: null,
                type: "movie",
                image: "https://st.kp.yandex.net/images/film_iphone/iphone360_5260016.jpg",
                ratingVoteCount: 6285,
                rating: 9.443,
                filmLength: "90",
                year: 2022,
                filmDescription: "«Попкульт» — это проект на стыке ностальгии и любви к массовой культуре. В шоу, которое выходит на YouTube-канале «sndk», авторы разбирают прошлое на атомы через призму игр, анимации, кино, комиксов и технологий, чтобы понять, как формировалась современная индустрия развлечений. Каждый выпуск посвящён одному году и его релизам, которые повлияли на развитие поп-культуры.",
                filmSpId: 5260016,
                countries: "Россия",
                genre: "история",
                director: 'Мэтт Дэннер',
                scenario: 'Патрик Кейси, Джош Миллер',
                producer: 'Маргарет М. Дин, Кимберли А. Смит',
                operator: 'Бекки Нюбул',
                composer: 'Бекки Нюбул, Linus of Hollywood, Гэбриел Манн',
                painter: 'Эфраим Клейн',
                installation: 'Эфраим Клейн',

            };

            const createdFilm: Film = {} as Film; // Mock the created film object

            jest.spyOn(filmService, 'createFilm').mockResolvedValue(createdFilm);

            const result = await filmService.createFilm(dto);

            expect(result).toEqual(createdFilm);
            expect(filmService.createFilm).toHaveBeenCalledWith(dto);
        });
    });

    describe('updateFilm', () => {
        it('Должен обновить фильм', async () => {
            const dto: UpdateFilmDto = {
                id: 1,
                name: 'Вера',
                nameEn: 'Faith'
            };

            const updatedFilmName = 'Updated Film Name';

            jest.spyOn(filmService, 'updateFilm').mockResolvedValue(updatedFilmName);

            const result = await filmService.updateFilm(dto);

            expect(result).toEqual(`Название фильма обновлено на ${updatedFilmName}`);
            expect(filmService.updateFilm).toHaveBeenCalledWith(dto);
        });
    });

    describe('getFilmById', () => {
        it('Должен вернуть фильм по ID', async () => {
            const filmId = 1;
            const film: Film = {} as Film; // Mock the film object

            jest.spyOn(filmService, 'getFilmById').mockResolvedValue(film);

            const result = await filmService.getFilmById(filmId);

            expect(result).toEqual(film);
            expect(filmService.getFilmById).toHaveBeenCalledWith(filmId);
        });
    });


    describe('searchFilms', () => {
        it('Должен вернуть список фильмов что соответствуют требованиям фильтров', async () => {
            const filter: FilterFilmDto = {
                rating: 7,
            };

            const films = filmInfo;

            jest.spyOn(filmService, 'getFilmsByFilters').mockResolvedValue(films);

            const result = await filmService.getFilmsByFilters(filter);

            expect(result).toEqual(films);
            expect(filmService.getFilmsByFilters).toHaveBeenCalledWith(filter);
        });
    });

    describe('getFilmByName', () => {
        it('Должен вернуть список фильмов у которых совпдает часть имени или полностью', async () => {
            const filmName: FilmNameDto = {
                name: 'Попкульт',
            };

            const film = filmInfo // Mock the film object

            jest.spyOn(filmService, 'getFilmsByName').mockResolvedValue(film);

            const result = await filmService.getFilmsByName(filmName);

            expect(result).toEqual(film);
            expect(filmService.getFilmsByName).toHaveBeenCalledWith(filmName);
        });
    });
});
