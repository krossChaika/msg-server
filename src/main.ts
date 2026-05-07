import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    console.log(process.env.CLIENT_URL);
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    });
    app.use(cookieParser());
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
