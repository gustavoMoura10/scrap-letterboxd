import { Injectable, OnModuleInit } from '@nestjs/common';
import initCycleTLS from 'cycletls';
@Injectable()
export class ScraperHttpClient {
    async getPage(url: string) {
        // Inicializa o cliente (ele gerencia o binário Go internamente)
        const cycleTLS = await initCycleTLS();

        try {
            const response = await cycleTLS.get(url, {
                ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513,29-23-24,0',
            });

            return {
                result: await response.text(),
                status: response.status,
            };
        } finally {
            cycleTLS.exit(); // Importante fechar para não vazar memória
        }
    }
}
