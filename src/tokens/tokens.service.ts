import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {Token} from './tokens.model';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class TokensService {
    constructor(
        @InjectModel(Token)
        private tokenModel: typeof Token,
        private jwtService: JwtService
    ) {
    }

    async generateTokens(payload) {
        const accessToken = this.jwtService.sign(payload, {expiresIn: '15s'});
        const refreshToken = this.jwtService.sign({id: payload.id}, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await this.tokenModel.findOne({where: {userId}});
        if (tokenData) {
            return this.tokenModel.update({refreshToken}, {where: {userId}});
        }
        const token = await this.tokenModel.create({userId, refreshToken});
        return token
    }

    async removeToken(refreshToken) {
        return this.tokenModel.update({refreshToken: ''}, {where: {refreshToken}});
    }

    async validateRefreshToken(token:string){
        try {
            // @ts-ignore
            const userData = await this.jwtService.verify(token);
            return userData;
        } catch (e) {
            throw new UnauthorizedException({message: 'validateRefreshToken Error'});
        }
    }

    async findRefreshToken(refreshToken: string) {
        const tokenData = await this.tokenModel.findOne({where: {refreshToken}});
        if(!tokenData){
            throw new UnauthorizedException({message: 'refreshToken Not found'});
        }
        return tokenData
    }

}
