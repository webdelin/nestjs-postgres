import {NestFactory} from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {AppModule} from "./app.module";


async function start() {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
        .setTitle('Affilibeans Backend')
        .setDescription('Backend mit api Swagger')
        .setVersion('1.0.0')
        .addTag('webdelin')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
    await app.listen(PORT, () =>  console.log(`Server running on PORT: ${PORT}`))
}

start()