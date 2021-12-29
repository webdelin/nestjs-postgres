import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {UsersService} from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import {v4 as uuidv4} from 'uuid';
import {TokensService} from "../tokens/tokens.service";
import {GetUserDto} from "../users/dto/get-user.dto";
import {UsersEmailService} from "../users/users-email.service";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private refreshService: TokensService,
        private userEmailService: UsersEmailService
    ) {
    }

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        const userDto = new GetUserDto(user);
        const tokens = await this.refreshService.generateTokens({...userDto});
        await this.refreshService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        };
    }

    async registration(dto: CreateUserDto) {
        const candidate = await this.usersService.getUserByEmail(dto.email);
        if (candidate) {
            throw new HttpException('User Email Exist', HttpStatus.BAD_REQUEST);
        }
        const activationLink = uuidv4();
        const hashPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({...dto, password: hashPassword, activationLink});
        await this.userEmailService.sendActivateEmail(user.email, activationLink);
        const userDto = new GetUserDto(user);
        const tokens = await this.refreshService.generateTokens({...userDto});
        await this.refreshService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        };
    }

    async activate(link:string){
        return await this.usersService.getActivateUser(link);
    }

    private async validateUser(dto: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(dto.email);
        const passwordEquals = await bcrypt.compare(dto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Password or Email incorrect'});
    }

    async logout(refreshToken) {
        return await this.refreshService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if(!refreshToken){
            throw new UnauthorizedException({message: 'refreshToken incorrect'});
        }
        const userData = await this.refreshService.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.refreshService.findRefreshToken(refreshToken);
        if(!userData&&!tokenFromDb){
            throw new UnauthorizedException({message: 'refresh not valid'});
        }
        const user = await this.usersService.getUserById(userData.id);
        const userDto = new GetUserDto(user);
        const tokens = await this.refreshService.generateTokens({...userDto});
        await this.refreshService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        };
    }

}
