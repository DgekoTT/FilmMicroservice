import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";



async function server() {
  const PORT = process.env.PORT || 4050;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    credentials: true,// отвечает за куки
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200
  });
  const config = new DocumentBuilder()
      .setTitle('Film microservice')
      .setDescription('Описание  API комментариев')
      .setVersion('1.0')
      .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.use(cookieParser());
  await app.listen(PORT, () => console.log(`Server Films is started on PORT = ${PORT} `))
}


server()



