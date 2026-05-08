import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    console.log(Number(process.env.PORT ?? 3000));
    app.enableCors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    });
    app.use(cookieParser());
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
