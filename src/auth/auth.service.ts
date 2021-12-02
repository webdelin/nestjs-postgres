import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {UsersService} from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import {User} from 'src/users/users.model';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
    }

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return this.generateToken(user);
    }

    async registration(dto: CreateUserDto) {
        console.log('auth.service.');
        const candidate = await this.usersService.getUserByEmail(dto.email);
        if (candidate) {
            throw new HttpException('User Email Exist', HttpStatus.BAD_REQUEST)
        }
        const activationLink = uuidv4();
        const hashPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({...dto, password: hashPassword, activationLink});
        return this.generateToken(user);
    }

    private async validateUser(dto: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(dto.email);
        const passwordEquals = await bcrypt.compare(dto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Password or Email incorrect'});
    }

    private async generateToken(user: User) {
        const paypload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(paypload)
        }
    }
}
