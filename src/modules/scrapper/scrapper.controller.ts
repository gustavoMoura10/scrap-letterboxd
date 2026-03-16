// scrapper.controller.ts
import { Controller, Get, Query, Param, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { ScrapperService } from './scrapper.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('scrapper')
export class ScrapperController {
    constructor(
        private readonly scraperService: ScrapperService,
        @Inject('SCRAPER_SERVICE') private client: ClientProxy // Cliente RabbitMQ
    ) { }

    @Get('letterboxd')
    async search(
        @Query('country') country: string,
        @Query('year') year: string,
    ) {
        const jobId = uuidv4(); // Gera um ID único para esta tarefa


        this.client.emit('process_movies', { jobId, country, year });

        return {
            message: 'Scraping iniciado. Guarde seu jobId.',
            jobId: jobId
        };
    }
    @EventPattern('process_movies')
    async handleProcessMovies(data: { jobId: string, country: string, year: string }) {
        await this.scraperService.getMoviesByFilters(data);
    }
    @Get('status/:jobId')
    async getStatus(@Param('jobId') jobId: string) {
        const result = await this.scraperService.getJobResult(jobId);
        if (!result) {
            return { status: 'Processing or Not Found' };
        }
        return result;
    }
}