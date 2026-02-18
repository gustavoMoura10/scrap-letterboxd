import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class ScraperHttpClient {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 10000,
            validateStatus: () => true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'x-requested-with': 'XMLHttpRequest',
                'Referer': 'https://letterboxd.com/'
            },
        });
    }

    async getPage(url: string): Promise<{ data: string | null; status: number }> {
        try {
            const response = await this.axiosInstance.get(url);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return { data: null, status: 500 };
        }
    }
}