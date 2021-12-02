import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {RolesService} from 'src/roles/roles.service';
import {AddRoleDto} from './dto/add-role.dto';
import {BanUserDto} from './dto/ban-user.dto';
import {CreateUserDto} from './dto/create-user.dto';
import {User} from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User,
                private rolesService: RolesService) {
    }
    async create(dto: CreateUserDto){
        console.log('user.service.');
        const user = await this.userModel.create(dto);
        const role = await this.rolesService.getRoleByValue('ADMIN');
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

    async addRole(dto: AddRoleDto) {
        const user = await this.userModel.findByPk(dto.userId);
        const role = await this.rolesService.getRoleByValue(dto.value);
        if(role && user){
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException('User or Role not Found', HttpStatus.NOT_FOUND);
    }

    async ban(dto: BanUserDto) {
        const user = await this.userModel.findByPk(dto.userId);
        if(!user) {
            throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }
}
