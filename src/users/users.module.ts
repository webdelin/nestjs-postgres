import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { UsersService } from './users.service';
import { UserRoles } from 'src/roles/user-roles.model';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
	imports: [
		SequelizeModule.forFeature([User, Role, UserRoles]),
		RolesModule
	],
	exports: [
		UsersService
	]
})
export class UsersModule {}