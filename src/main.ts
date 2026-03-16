import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'movies_queue',
      queueOptions: {
        durable: false, // 'false' significa que a fila some se o RabbitMQ reiniciar
      },
      // Opcional: define que o worker processa uma mensagem por vez
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0');
  console.log('🚀 API rodando em http://localhost:3000');
  console.log('🐰 RabbitMQ Worker conectado e aguardando mensagens');
}
bootstrap();