import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV_LOCAL });
dotenv.config({ path: process.env.NODE_ENV });

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import * as cookieParser from 'cookie-parser';
import { PoolClient } from 'pg';
import { FilmModule } from '../src/film/film.module';
import { Sequelize } from 'sequelize';
import { AppModule } from '../src/app.module';

describe('Films e2e', () => {
  let app: INestApplication;
  let filmPoolClient: PoolClient;
  let filmPool: PoolClient;

  let film;
  let filmUpdateData;
  let filmOldData;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FilmModule, Sequelize, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    await app.init();

    filmPoolClient = await filmPool.connect();

   // await request(app.getHttpServer()).get('/init').expect(200);

    await request(app.getHttpServer())
      .post('/films/random')
      /* .send({
        email: process.env.OWNER_MAIL,
        password: process.env.OWNER_PASSWORD,
      }) */
      .expect((response: request.Response) => {
        film = response.body;
      });
    filmUpdateData = {
      nameRu: 'AVATAR NEW',
    };
    filmOldData = {
      nameRu: 'Аватар: Легенда об Аанге',
    };
  });

  it('Get all movies, check default count, 200', async () => {
    return await request(app.getHttpServer())
      .get('/movies')
      .expect((response: request.Response) => {
        const body = response.body;
        expect(body.count).toBe(2621);
        expect(body.rows.length).toBe(10);
      })
      .expect(HttpStatus.OK);
  });
})