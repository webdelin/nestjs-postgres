import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({example:'test@test.net', description: 'Email Adress'})
    @IsString({message: 'Is a String'})
    @IsEmail({}, {message: 'Add valide email'})
    readonly email: string;
    @ApiProperty({example:'Ab123#aB', description: 'Strong Password'})
    @IsString({message: 'Is a String'})
    @Length(4, 16, {message: 'Min 4, Max 16 Characters'})
    readonly password: string;
}