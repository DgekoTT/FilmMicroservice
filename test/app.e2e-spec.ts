import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let user;
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InF3ZXN0ZXJuMTNAbWFpbC5ydSIsImlkIjoxLCJyb2xlcyI6W3siaWQiOjEsInZhbHVlIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ImFkbWluaXN0cmF0b3IiLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTI0VDA4OjE5OjM5LjgzM1oiLCJ1cGRhdGVkQXQiOiIyMDIzLTA1LTI0VDA4OjE5OjM5LjgzM1oiLCJVc2VyUm9sZXMiOnsiaWQiOjEsInJvbGVJZCI6MSwidXNlcklkIjoxfX1dLCJkaXNwbGF5TmFtZSI6ImFkbWluNCIsImlhdCI6MTY4NTk1Mjg4OCwiZXhwIjoxNjg2MDM5Mjg4fQ.mdZLpD6Fzica-_2-4LgCK0BuG3wyUZa39mJDZ7njSiM'

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser(token));
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
     // .expect(404)
      .expect((response: request.Response) => {
        const body = response.body;
        console.log(body);
        expect(body.rows.length).toBe(30);
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
  it('create film', () => {
    return request(app.getHttpServer())
      .post('/films')
      .send({
        filmSpId: 123,
        name: "Movie",
        nameEn: "Movie",
        type: "movie",
        image: "http://movie.com",
        ratingVoteCount: 80,
        rating: 9.5,
        countries: "US",
        genre: "action",
        filmLength: "1h24m",
        year: 1990,
        filmDescription: "string"
      })
      .expect(403)
  });
});
