<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation
Клонируем проект далее
```bash
$ npm install (устанавливаем все необходимые зависимости)
```
для полной работы небходим микросервис https://github.com/DgekoTT/PersonsMicroService

#установка RabbitMQ
$ npm i --save amqplib amqp-connection-manager 

#Configuration
$ npm i --save @nestjs/config

#Sequelize Integration
$ npm install --save @nestjs/sequelize sequelize sequelize-typescript
$ npm install --save-dev @types/sequelize

# Postgres
$ npm install --save pg pg-hstore 

## Running the app

#через Pgadmin4 
создаем бд filmmicro

#для запуска сервера

npm run start:devFilm

#для прослушивания сообщений

npm run listenFilm

API

Перед началом работы оправляем запрос 
@Post http://localhost:5000/countries/load загружаются все страны в бд

@Post http://localhost:5000/genres/load загружаются все жанры в бд

@Post http://localhost:5000/films/load загружаются все фильмы в бд

Создание фильма
@Post http://localhost:5000/films через @Body передаем параметры

обновление названия фильма
@Put http://localhost:5000/films/update через @Body передаем параметры

получение фильма по id
@Get http://localhost:5000/films/:id 

получение фильма по жанру
@Get http://localhost:5000/films/genre

получение фильма по стране
@Get http://localhost:5000/films/country

получение фильма по рейтингу
@Get http://localhost:5000/films/rating/:rating

получение фильма по количеству оценок
@Get http://localhost:5000/films/amount/:amount

Работа с жанрами

Создать жанр
@Post http://localhost:5000/genres через @Body передаем параметры

Изменить имя жанра
@Put http://localhost:5000/genres/update через @Body передаем параметры

Получить все сценарии
@Get http://localhost:5000/genres/

Получить сценарий по id 
 @Get http://localhost:5000/genres/:id
