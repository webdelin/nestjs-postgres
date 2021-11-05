import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User,
                private rolesService: RolesService) {
    }
    async create(dto: CreateUserDto){
        const user = await this.userModel.create(dto);
        const role = await this.rolesService.getRoleByValue('USER');
        await user.$set('roles', [role.id]);
        user.roles = [role]
        return user;
    }
    async getUsers(){
        const users = await this.userModel.findAll({include: {all: true} });
        return users;
    }

    async getUserByEmail(email: string){
        const user =await this.userModel.findOne({where: {email}, include: {all:true}});
        return user;
    }
}
