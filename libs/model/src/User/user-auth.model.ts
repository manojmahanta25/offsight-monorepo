import {BelongsTo, Column, DataType, Default, ForeignKey, Model, Table} from "sequelize-typescript";
import {UserModel} from "./user.model";

@Table({tableName: 'user_auth_data', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at'})
export class UserAuthModel extends Model<UserAuthModel> {

    @Column({field: 'id', type: DataType.BIGINT, primaryKey: true, autoIncrement: true})
    id: number;

    @ForeignKey(() => UserModel)
    @Column({field: 'user_id', type: DataType.BIGINT, references: {model: UserModel, key: 'client_user_id'} })
    userId: number;

    @Column({field: 'client_id', type: DataType.BIGINT})
    clientId: number;

    @Column({field: 'device_identifier', type: DataType.STRING, allowNull: true})
    deviceIdentifier: string;

    @Column({field: 'refresher_token', type: DataType.STRING, allowNull: true})
    refresherToken: string;

    @Column({field: 'refresher_salt', type: DataType.STRING, allowNull: true})
    refresherSalt: string;

    @Column({field: 'last_login_ip', type: DataType.STRING, allowNull: true})
    lastLoginIp: string;


    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataType.NOW,
        comment: 'Creation date of the record',
        primaryKey: false,
        autoIncrement: false,
        unique: false
    })
    createdAt: Date;

    @BelongsTo(()=>UserModel)
    user: UserModel;
}