import { Injectable, Logger } from '@nestjs/common';
import { ScraperHttpClient } from 'src/config/scraper-client';
import * as cheerio from 'cheerio';
import { Movie } from 'src/interfaces/Movie';

@Injectable()
export class ScrapperService {
    private readonly logger = new Logger(ScrapperService.name);
    constructor(private readonly httpClient: ScraperHttpClient) {

    }

    async getMoviesByFilters(country: string, year: string) {
        // Formata os parâmetros para o padrão da URL do Letterboxd (slugify básico)
        const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
        const url = `https://letterboxd.com/films/ajax/country/${countrySlug}/year/${year}/?esiAllowFilters=true`;


        this.logger.log(`Iniciando scraping na URL: ${url}`);

        const { data, status } = await this.httpClient.getPage(url);

        if (status !== 200 || !data) {
            this.logger.error(`Falha ao acessar site. Status: ${status}`);
            return { success: false, status, titles: [] };
        }

        let $ = cheerio.load(data);
        const movies: Movie[] = [];

        const elements = $('li.posteritem div').toArray();
        for (const element of elements) {
            const link = $(element).attr('data-item-link') || '';
            const title = $(element).attr('data-item-name') || '';
            const info = await this.httpClient.getPage(`https://letterboxd.com${link}genres/`);
            if (info.data) {
                $ = cheerio.load(info.data);
                const allLanguages: string[] = [];
                const allGenres: string[] = [];
                const allcountries: string[] = [];
                $('a[href^="/films/language/"]').each((i, el) => {
                    allLanguages.push($(el).text().trim());
                });
                $('a[href^="/films/genre/"]').each((i, el) => {
                    allGenres.push($(el).text().trim());
                });
                $('a[href^="/films/country/"]').each((i, el) => {
                    allcountries.push($(el).text().trim());
                });
                movies.push({
                    title,
                    year,
                    genres: allGenres,
                    link: `https://letterboxd.com${link}`,
                    languages: allLanguages.length > 0 ? allLanguages : null,
                    countries: allcountries.length > 0 ? allcountries : null,
                });
            }
        }

        return {
            success: true,
            count: movies.length,
            movies,
        };
    }
}
