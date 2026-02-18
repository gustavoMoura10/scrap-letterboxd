import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperService } from './scrapper/scrapper.service';
import { ScrapperController } from './scrapper/scrapper.controller';
import { ScraperHttpClient } from './config/scraper-client';

@Module({
  imports: [],
  controllers: [AppController, ScrapperController],
  providers: [AppService, ScrapperService, ScraperHttpClient],
})
export class AppModule { }
