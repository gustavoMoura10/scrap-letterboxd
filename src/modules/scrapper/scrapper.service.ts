import { Injectable, Logger } from '@nestjs/common';
import { ScraperHttpClient } from 'src/config/scraper-client';
import * as cheerio from 'cheerio';
import { Movie } from 'src/interfaces/Movie';
import { Payload } from '@nestjs/microservices';

@Injectable()
export class ScrapperService {
    private readonly logger = new Logger(ScrapperService.name);
    private results = new Map<string, any>();

    constructor(private readonly httpClient: ScraperHttpClient) {

    }

    async getMoviesByFilters(@Payload() data: { jobId: string, country: string, year: string }) {
        const { jobId, country, year } = data;
        this.logger.log(`Recebido jobId: ${jobId} para país: ${country} e ano: ${year}`);

        try {
            const result = await this.getMoviesByCountryAndYear(country, year, jobId);

            this.results.set(jobId, { status: 'completed', data: result });
        } catch (error) {
            this.logger.error(`Erro no job ${jobId}: ${error.message}`);
            this.results.set(jobId, { status: 'failed', error: error.message });
        }

    }
    async getJobResult(jobId: string) {
        return this.results.get(jobId);
    }
    async getMoviesByCountryAndYear(country: string, year: string, jobId: string) {
        let progress = 0;
        const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
        let haveNext = true;
        const movies: Movie[] = [];
        let totalNumeric;
        let page = 1;
        let url = `https://letterboxd.com/films/ajax/country/${countrySlug}/year/${year}/page/${page}/`;
        while (haveNext) {
            this.logger.log(`Iniciando scraping na URL: ${url}`);

            let { result, status } = await this.httpClient.getPage(`${url}/?esiAllowFilters=true`);
            if (status !== 200 || !result) {
                this.logger.error(`Falha ao acessar site. Status: ${status}`);
                return { success: false, status, titles: [] };
            }

            let $titlesPage = cheerio.load(result);
            if (totalNumeric === undefined) {
                const text = `${$titlesPage('p.ui-block-heading').text()}`;
                const totalNumericMatch = text.match(/[\d,]+/);
                totalNumeric = totalNumericMatch ? parseInt(totalNumericMatch[0].replace(/,/g, '')) : 0;
            }
            const elements = $titlesPage('li.posteritem div.react-component').toArray();
            for (const element of elements) {
                progress++;
                if (progress % 10 === 0) {
                    this.logger.log(`Progresso do job ${jobId}: ${progress}/${totalNumeric} filmes processados.`);
                    this.results.set(jobId, { status: 'in_progress', progress, total: totalNumeric });
                }
                const link = $titlesPage(element).attr('data-item-link') || '';
                const title = $titlesPage(element).attr('data-item-name') || '';
                if (link) {
                    const info = await this.httpClient.getPage(`https://letterboxd.com${link}/`);
                    if (info.result) {
                        let $movieInfo = cheerio.load(info.result);
                        const allLanguages: string[] = [];
                        const allGenres: string[] = [];
                        const allcountries: string[] = [];
                        $movieInfo('a[href^="/films/language/"]').each((i, el) => {
                            allLanguages.push($movieInfo(el).text().trim());
                        });
                        $movieInfo('a[href^="/films/genre/"]').each((i, el) => {
                            allGenres.push($movieInfo(el).text().trim());
                        });
                        $movieInfo('a[href^="/films/country/"]').each((i, el) => {
                            allcountries.push($movieInfo(el).text().trim());
                        });
                        movies.push({
                            title,
                            year,
                            genres: allGenres,
                            link: `https://letterboxd.com${link}`,
                            languages: allLanguages.length > 0 ? allLanguages : null,
                            countries: allcountries.length > 0 ? allcountries : null,
                            originalTitle: null,
                        });
                    }
                }
            }
            page++;
            haveNext = $titlesPage('a.next').length > 0;
        }

        return {
            success: true,
            count: movies.length,
            movies,
        };
    }
}
