import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {ROLES_KEY} from "./roles-auth.decorator";
import {TokensService} from "../tokens/tokens.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private refreshService: TokensService
    ) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requireRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])
            if (!requireRoles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Invalid Token -> User unauthorized'})
            }

            const user = this.refreshService.validateUserToken(token);
            req.user = user;
            return user.roles.some(role => requireRoles.includes(role.value));
        } catch (e) {
            console.log(e)
            throw new HttpException('User Roles permission', HttpStatus.FORBIDDEN);
        }
    }
}
