import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {TokensModule} from "../tokens/tokens.module";
import {UsersEmailService} from "../users/users-email.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      UsersEmailService,
      forwardRef(() => UsersModule),
      JwtModule.register({
          secret: process.env.PRIVATE_KEY || '3082580b-3d74-409e-a14c-354ddb28ca2b',
          signOptions: { expiresIn: '15m'}
      }),
      TokensModule
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
