import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {UserModel} from "./user.model";
import {UserClientPivotModel} from "./user-client-pivot.model";


@Table({tableName: 'user_permission', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at'})
export class UserPermissionModel extends Model<UserPermissionModel> {
    @Column({field: 'id', type:DataType.BIGINT ,primaryKey: true, autoIncrement: true})
    id: number;

    @ForeignKey(() => UserClientPivotModel)
    @Column({field: 'client_user_pivot_id', unique: true, type:DataType.BIGINT ,references: {model: UserClientPivotModel, key: 'id'}})
    clientUserPivotId: number;

    @Column({field: 'is_edit_allowed', type:DataType.TINYINT ,allowNull: true})
    isEditAllowed: boolean;

    @Column({field: 'edit_permission', type:DataType.TINYINT ,allowNull: true})
    editPermission: boolean;
}