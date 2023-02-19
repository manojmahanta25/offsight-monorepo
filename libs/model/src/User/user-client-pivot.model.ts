import {Column, ForeignKey, Model, Table, DataType, BelongsTo, PrimaryKey} from "sequelize-typescript";
import {ClientModel} from "@app/model/Client/client.model";
import {UserModel} from "./user.model";
import {userType} from "./user.enum";


@Table({tableName: 'client_user_pivot', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at'})
export class UserClientPivotModel extends Model<UserClientPivotModel> {

        @Column({field: 'id', type: DataType.BIGINT, primaryKey: true, autoIncrement: true})
        id: number;

        @ForeignKey(() => ClientModel)
        @Column({field: 'client_id', type: DataType.BIGINT, references: {model: ClientModel, key: 'client_id'}})
        clientId: number;

        @ForeignKey(() => UserModel)
        @Column({field: 'user_id', type: DataType.BIGINT, references: {model: UserModel, key: 'client_user_id'}})
        userId: number;

        @Column({field: 'user_type', type: DataType.ENUM(userType.IOT, userType.MANAGER, userType.OperatorQualityInspector)})
        userType: userType;


        @Column({field: 'is_active', type: DataType.INTEGER, defaultValue:1})
        isActive: number;

        @Column({field: 'user_group_id', type: DataType.BIGINT})
        userGroupId: number;

        @BelongsTo(() => ClientModel)
        client: ClientModel;

        @BelongsTo(() => UserModel)
        user: UserModel;

}
