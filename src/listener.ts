import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Transport} from "@nestjs/microservices";


async function microService() {

    const app = await NestFactory.createMicroservice(AppModule,{
        transport: Transport.RMQ,
        options: {
            urls: [`${process.env.RABBITMQ}`],
            queue: 'persons_queue',
            queueOptions: {
                durable: false
            },
        },
    });

    await app.listen()
    console.log("MicroService Films is listening")
}


microService()
