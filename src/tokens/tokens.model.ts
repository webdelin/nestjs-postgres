import {ApiProperty} from '@nestjs/swagger';
import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import {User} from '../users/users.model';

interface TokenCreationAttrs {
    refreshToken: string;
    userId: string;
}

@Table({tableName: 'tokens'})
export class Token extends Model<Token, TokenCreationAttrs> {

    @ApiProperty({example:'Description', description: 'Post description'})
    @Column({type: DataType.STRING, allowNull: false})
    refreshToken: string;

    @ForeignKey(() => User)
    @Column({type: DataType.UUID, unique: true})
    userId: string;

    @BelongsTo(() => User)
    token: User;
}
