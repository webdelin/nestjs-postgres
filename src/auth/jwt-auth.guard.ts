import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {TokensService} from "../tokens/tokens.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private refreshService: TokensService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            const authHeader = req.headers?.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Invalid Token -> User unauthorized'})
            }

            const user = this.refreshService.validateUserToken(token);
            req.user = user;
            return true;
        } catch (e) {
            console.log(e)
            throw new UnauthorizedException({message: 'User unauthorized'})
        }
    }
}
