import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({example:'test@test.net', description: 'Email Adress'})
    readonly email: string;
    @ApiProperty({example:'Ab123#aB', description: 'Strong Password'})
    readonly password: string;
}