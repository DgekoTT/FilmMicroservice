import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let user;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "admin",
        password: "123456",
      })
      .expect((response: request.Response) => {
        user = response.body;
      }); 
  });

   it('random 30 films', () => {
    return request(app.getHttpServer())
      .get('/films/random')
      .expect(200)
      .expect((response: request.Response) => {
        const body = response.body;
        console.log(body);

        expect(body).not.toBeNull();
      })
  }); 
  it('film by id', () => {
    return request(app.getHttpServer())
      .get('/films/id/1')
      .expect(200)
      .expect((response: request.Response) => {
        const body = response.body;
        const filmWhereId1 = {"countries": [], "filmDescription": null, "filmLength": "200", "filmSpId": 234, "genre": [], "id": 1, "image": "image", "name": "лицо со шрамом", "nameEn": "scarface", "rating": 5, "ratingVoteCount": 3322, "type": "action", "year": 1990}
        console.log(body);
        expect(body).toEqual(filmWhereId1);
      })
  }); 
  it('film by SpId', () => {
    return request(app.getHttpServer())
      .get('/films/sp/234')
      .expect(200)
      .expect((response: request.Response) => {
        const body = response.body;
        const filmWhereSpId234 = {"countries": [], "filmDescription": null, "filmLength": "200", "filmSpId": 234, "genre": [], "id": 1, "image": "image", "name": "лицо со шрамом", "nameEn": "scarface", "rating": 5, "ratingVoteCount": 3322, "type": "action", "year": 1990}
        console.log(body);
        expect(body).toEqual(filmWhereSpId234);
      })
  }); 
