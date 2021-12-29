import {Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {User} from './users/users.model';
import {Role} from './roles/roles.model';
import {RolesModule} from './roles/roles.module';
import {UserRoles} from './roles/user-roles.model';
import {AuthModule} from './auth/auth.module';
import {PostsModule} from './posts/posts.module';
import {Post} from './posts/posts.model';
import {FilesModule} from './files/files.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import {Token} from "./tokens/tokens.model";
import {TokensModule} from "./tokens/tokens.module";
import {MailerModule} from '@nestjs-modules/mailer';
import * as path from 'path';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static')
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRoles, Post, Token],
            autoLoadModels: true
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_SMTP_PORT,
                secure: process.env.EMAIL_SSL,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            }
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        PostsModule,
        FilesModule,
        TokensModule
    ]
})

export class AppModule {
}
