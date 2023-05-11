import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";
import * as cors from 'cors';



async function server() {
  const PORT = process.env.PORT || 4050;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`Server Films is started on PORT = ${PORT} `))
}



server()



