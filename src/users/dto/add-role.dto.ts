import { IsString } from "class-validator";

export class AddRoleDto {

    @IsString({message: 'Value is a String'})
    readonly value: string;

    @IsString({message: 'userId is a String'})
    readonly userId: string;
}