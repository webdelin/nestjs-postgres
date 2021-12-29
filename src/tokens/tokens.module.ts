import {forwardRef, Module} from '@nestjs/common';
import {TokensService} from './tokens.service';
import {TokensController} from './tokens.controller';
import {SequelizeModule} from '@nestjs/sequelize';
import {User} from 'src/users/users.model';
import {Token} from './tokens.model';
import {AuthModule} from 'src/auth/auth.module';
import {JwtModule} from "@nestjs/jwt";

@Module({
  providers: [TokensService],
  controllers: [TokensController],
  imports: [
    SequelizeModule.forFeature([User, Token]),
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.REFRESH_TOKEN,
      signOptions: { expiresIn: '30d'}
    })
  ],
  exports: [TokensService, JwtModule]
})
export class TokensModule {}
