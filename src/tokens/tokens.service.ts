import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {Token} from './tokens.model';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class TokensService {
    private REFRESH_TOKEN = process.env.REFRESH_TOKEN
    private PRIVATE_KEY = process.env.PRIVATE_KEY

    constructor(
        @InjectModel(Token)
        private tokenModel: typeof Token,
        private jwtService: JwtService
    ) {
    }

    async generateTokens(payload) {
        const accessToken = this.jwtService.sign(payload, {secret: this.PRIVATE_KEY, expiresIn: '15m'});
        const refreshToken = this.jwtService.sign({id: payload.id}, {secret: this.REFRESH_TOKEN, expiresIn: '30d'});
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
        return await this.tokenModel.create({userId, refreshToken});
    }

    async removeToken(refreshToken) {
        return this.tokenModel.update({refreshToken: ''}, {where: {refreshToken}});
    }

    validateUserToken(token: string) {
        try {
            return this.jwtService.verify(token, {secret: this.PRIVATE_KEY});
        } catch (e) {
            throw new UnauthorizedException({message: 'validateUserToken Error'});
        }
    }

    async validateRefreshToken(token: string) {
        try {
            return await this.jwtService.verify(token, {secret: this.REFRESH_TOKEN});
        } catch (e) {
            throw new UnauthorizedException({message: 'validateRefreshToken Error'});
        }
    }

    async findRefreshToken(refreshToken: string) {
        const tokenData = await this.tokenModel.findOne({where: {refreshToken}});
        if (!tokenData) {
            throw new UnauthorizedException({message: 'refreshToken Not found'});
        }
        return tokenData
    }

}
