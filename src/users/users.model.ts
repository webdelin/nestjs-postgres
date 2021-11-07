import { ApiProperty } from '@nestjs/swagger';
import {BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Post } from 'src/posts/posts.model';
import { UserRoles } from 'src/roles/user-roles.model';
import {Role} from './../roles/roles.model';
interface UserCreationAttrs {
	email: string;
	password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
	@ApiProperty({example:'7f5397f2-6648-440f-84de-e150f6bc3e1a', description: 'UUID Version 4'})
	@Column({type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4})
	id: string;

	@ApiProperty({example:'test@test.net', description: 'Email Adress'})
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	email: string;

	@ApiProperty({example:'Ab123#aB', description: 'Strong Password'})
	@Column({type: DataType.STRING, allowNull: false})
	password: string;

	@ApiProperty({example:'false', description: 'User Banned -> Dafault false'})
	@Column({type: DataType.BOOLEAN, defaultValue: false})
	banned: boolean;

	@ApiProperty({example:'User Banned', description: 'User Banned notice'})
	@Column({type: DataType.STRING, allowNull: true})
	banReason: string;

	@BelongsToMany(() => Role, () => UserRoles)
	roles: Role[];

	@HasMany(() => Post)
	posts: Post[];
}