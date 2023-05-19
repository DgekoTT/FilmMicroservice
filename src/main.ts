import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';



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
  app.use(cookieParser());
  await app.listen(PORT, () => console.log(`Server Films is started on PORT = ${PORT} `))
}


server()



