import { Controller, Get, Query } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
    constructor(private readonly scraperService: ScrapperService) { }
    @Get('letterboxd')
    async search(
        @Query('country') country: string,
        @Query('year') year: string,
    ) {
        return await this.scraperService.getMoviesByFilters(country, year);
    }
}
