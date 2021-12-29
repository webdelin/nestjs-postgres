import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppModule} from "./app.module";
import {ValidationPipe} from "./pipes/validation.pipe";
import * as cookieParser from 'cookie-parser';

async function start() {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    app.enableCors({credentials: true, origin: "http://localhost:8080"});
    app.use(cookieParser());
    const config = new DocumentBuilder()
        .setTitle('Affilibeans Backend')
        .setDescription('Backend mit api Swagger')
        .setVersion('1.0.0')
        .addTag('webdelin')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, () =>  console.log(`Server running on PORT: ${PORT}`))
}

start();
