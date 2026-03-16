import { Test, TestingModule } from '@nestjs/testing';
import { ScrapperController } from './scrapper.controller';
import { ScraperHttpClient } from 'src/config/scraper-client';

describe('ScrapperController', () => {
  let controller: ScrapperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapperController],
      providers: [ScraperHttpClient]
    }).compile();

    controller = module.get<ScrapperController>(ScrapperController);
    
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
