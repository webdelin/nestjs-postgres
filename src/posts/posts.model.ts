import { ApiProperty } from '@nestjs/swagger';
import {BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserRoles } from 'src/roles/user-roles.model';
import { User } from 'src/users/users.model';
import {Role} from './../roles/roles.model';
interface PostCreationAttrs {
    title: string;
    description: string;
    image: string;
    active: boolean;
    userId: string;
}

@Table({tableName: 'posts'})
export class Post extends Model<Post, PostCreationAttrs> {
    @ApiProperty({example:'1', description: 'Post ID'})
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true})
    id: number;

    @ApiProperty({example:'Description', description: 'Post description'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @ApiProperty({example:'true', description: 'Post Active -> Dafault true'})
    @Column({type: DataType.BOOLEAN, defaultValue: true})
    active: boolean;

    @ApiProperty({example:'Image', description: 'Image Path'})
    @Column({type: DataType.STRING})
    image: string;

    @ForeignKey(() => User)
    @Column({type: DataType.UUID})
    userId: string;

    @BelongsTo(() => User)
    author: User;
}