import {Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {
    }
    @ApiOperation({summary: 'Create User'})
    @ApiResponse({status: 201, type: User})
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }
    @ApiOperation({summary: 'Get all Users'})
    @ApiResponse({status: 200, type: [User]})
    @Get()
    getAll() {
        return this.userService.getUsers();
    }
}
