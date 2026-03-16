import { Injectable, OnModuleInit, OnModuleDestroy, InternalServerErrorException } from '@nestjs/common';
import initCycleTLS, { CycleTLSClient } from 'cycletls';

@Injectable()
export class ScraperHttpClient implements OnModuleInit, OnModuleDestroy {
    private cycleTLS: CycleTLSClient;

    // Inicializa o serviço uma única vez quando o NestJS sobe
    async onModuleInit() {
        try {
            this.cycleTLS = await initCycleTLS();
            console.log('CycleTLS initialized successfully');
        } catch (error) {
            console.error('Failed to initialize CycleTLS:', error);
        }
    }

    // Fecha o processo do CycleTLS quando a aplicação desliga
    async onModuleDestroy() {
        if (this.cycleTLS) {
            await this.cycleTLS.exit();
        }
    }

    async getPage(url: string) {
        // Verifica se o serviço está pronto
        if (!this.cycleTLS) {
            throw new InternalServerErrorException('CycleTLS not initialized');
        }

        try {
            const response = await this.cycleTLS.get(url, {
                ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513,29-23-24,0',
            
            });

            if (response.status !== 200) {
                throw new Error(`Failed to fetch page. Status: ${response.status}`);
            }

            return {
                result: await response.text(), // CycleTLS já retorna o corpo em .body
                status: response.status,
            };
        } catch (error) {
            console.error(`Error fetching URL ${url}:`, error.message);
            throw error;
        }
        // NÃO use cycleTLS.exit() aqui!
    }
}