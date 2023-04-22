import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {GenreService} from "./genre/genre.service";




async function server() {
  const PORT = process.env.PORT || 4050;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`Server Films is started on PORT = ${PORT} `))
}



server()

