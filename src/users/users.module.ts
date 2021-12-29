import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {UsersController} from './users.controller';
import {User} from './users.model';
import {Role} from '../roles/roles.model';
import {UsersService} from './users.service';
import {UserRoles} from 'src/roles/user-roles.model';
import {RolesModule} from 'src/roles/roles.module';
import {AuthModule} from 'src/auth/auth.module';
import {Post} from 'src/posts/posts.model';
import {UsersEmailService} from "./users-email.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService,UsersEmailService],
	imports: [
		SequelizeModule.forFeature([User, Role, UserRoles, Post]),
		RolesModule,
		forwardRef(() => AuthModule)
	],
	exports: [
		UsersService,
		UsersEmailService
	]
})
export class UsersModule {}
