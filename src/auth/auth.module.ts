import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {TokensModule} from "../tokens/tokens.module";
import {UsersEmailService} from "../users/users-email.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersEmailService,
        forwardRef(() => UsersModule),
        TokensModule
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule {
}
