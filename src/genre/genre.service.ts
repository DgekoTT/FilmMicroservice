
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Genres} from "./genre.model";
import {CreateGenreDto} from "./dto/create.genre.dto";
import {UpdateGenreDto} from "./dto/update.genre.dto";
import {Op} from "sequelize";


@Injectable()
export class GenreService {

    constructor(@InjectModel(Genres) private genreRepository: typeof Genres) {
    }
    async createGenre(dto: CreateGenreDto) {
        const role = await this.genreRepository.create(dto);
        return role;
    }

    async getGenreById(id: number) {
        const role = await this.genreRepository.findOne({where: {id}});
        return role;
    }

    async getAllGenres() {
        const allGenres= await this.genreRepository.findAll();
        return allGenres;
    }

    async updateGenre(dto: UpdateGenreDto) {
        let genre = await this.genreRepository.findOne({where: {id: dto.id}});
        this.checkerGenre(genre);
        let success = await this.genreRepository.update({...dto}, {
            where: {
                id: dto.id
            }
        });
        if (success) return `Жанр успешно обновлен`;
        throw new HttpException('Ошибка обновления жанра', HttpStatus.BAD_REQUEST);
    }


    checkerGenre(genre:any) {
        if (!genre) {
            throw new HttpException('Жанр с данным id не найден', HttpStatus.NOT_FOUND);
        }
    }

    async getGenre(genre: string[]): Promise<Genres[]> {
        let genresInDb = await this.genreRepository.findAll({
            where: {
                name: { [Op.in]: genre }
            }
        })
        return genresInDb;
    }

    async getGenreId(genre: string): Promise<Genres> {
        let genreObj = await this.genreRepository.findOne({
            where: {
                name: {genre}
            }
        })
        return genreObj;
    }
}
