import { Test, TestingModule } from '@nestjs/testing';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { JwtService } from '@nestjs/jwt';

describe('FilmControllerTest', () => {
    let filmController: FilmController;
    let spyService: FilmService;

    const mockFilmService = {

    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilmController],
            providers: [
                FilmService,
                JwtService
            ]
        }).overrideProvider(FilmService)
            .useValue(mockFilmService)
            .compile();

        filmController = module.get<FilmController>(FilmController);
        spyService = module.get<FilmService>(FilmService);
    });

    it('should be defined', () => {
        expect(filmController).toBeDefined();
    });

    it('should be call loadActors', () => {
    });
});