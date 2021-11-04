import { ApiProperty } from '@nestjs/swagger';
import {BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import {User} from '../users/users.model';
import { UserRoles } from './user-roles.model';
interface RoleCreationAttrs {
	value: string;
	description: string;
}

@Table({tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttrs> {
	@ApiProperty({example:'1', description: 'Role ID'})
	@Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true})
	id: number;

	@ApiProperty({example:'ADMIN', description: 'Unique Role-Value'})
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	value: string;

	@ApiProperty({example:'Administrator', description: 'Role Description'})
	@Column({type: DataType.STRING, allowNull: false})
	description: string;

	@BelongsToMany(() => User, () => UserRoles)
	users: User[];
}