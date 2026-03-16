import { Module } from '@nestjs/common';
import { ScrapperService } from './modules/scrapper/scrapper.service';
import { ScrapperController } from './modules/scrapper/scrapper.controller';
import { ScraperHttpClient } from './config/scraper-client';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCRAPER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Altere para sua URL do RabbitMQ
          queue: 'movies_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ])],
  controllers: [ScrapperController],
  providers: [ScrapperService, ScraperHttpClient],
})
export class AppModule { }
