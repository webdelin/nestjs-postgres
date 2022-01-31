import {Body, Controller, Get, Param, Post, Req, Res} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {AuthService} from './auth.service';
import {User} from "../users/users.model";
import {Request, Response} from 'express';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    expiresDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30d
    constructor(
        private authService: AuthService
    ) {
    }

    @ApiOperation({summary: 'Login User'})
    @ApiResponse({status: 201, type: User})
    @Post('/login')
    async login(
        @Res({ passthrough: true }) res: Response,
        @Body() dto: CreateUserDto,
    ) {
        console.log(dto)
        const userData = await this.authService.login(dto);
        await res.cookie('refreshToken', userData.refreshToken,{httpOnly:true, expires: this.expiresDate});
        return {...userData};
    }

    @ApiOperation({summary: 'Registration User'})
    @ApiResponse({status: 201, type: User})
    @Post('/registration')
    async registration(
        @Res({ passthrough: true }) res: Response,
        @Body() dto: CreateUserDto
    ) {
        const userData = await this.authService.registration(dto);
        await res.cookie('refreshToken', userData.refreshToken,{httpOnly:true, expires: this.expiresDate});
        return {...userData};
    }

    @ApiOperation({summary: 'User Activation Link'})
    @ApiResponse({status: 201})
    @Get('/activate/:activationLink')
    public activate(@Param('activationLink') activationLink) {
        return this.authService.activate(activationLink);
    }

    @Post('/logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { refreshToken } = req.cookies;
        await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken')
        return req.cookies;
    }

    @Get('/refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    )
    {
        const {refreshToken} = await req.cookies;
        const tokensData = await this.authService.refresh(refreshToken)
        await res.cookie('refreshToken', tokensData.refreshToken,{httpOnly:true, expires: this.expiresDate});
        return tokensData
    }

}
