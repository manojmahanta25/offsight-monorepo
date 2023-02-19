import {userType} from './user.enum';
import {
    AllowNull,
    BelongsTo, BelongsToMany,
    Column,
    DataType, Default, ForeignKey, HasMany,
    Model,
    Table
} from "sequelize-typescript";
import {ClientModel} from "@app/model/Client/client.model";
import {UserAuthModel} from "./user-auth.model";
import {UserClientPivotModel} from "./user-client-pivot.model";


@Table({tableName: 'user', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at'})
export class UserModel extends Model<UserModel> {

    @Column({field: 'client_user_id', type: DataType.BIGINT, primaryKey: true, autoIncrement: true})
    id: number;

    @Column({field: 'client_user_first_name', type: DataType.STRING})
    firstName: string;

    @Column({field: 'client_user_last_name', type: DataType.STRING})
    lastName: string;

    @AllowNull
    @Column({field: 'client_user_email', type: DataType.TEXT})
    email: string;

    @Column({field: 'client_user_username', type: DataType.STRING, unique: true})
    username: string;

    @Column({field: 'client_user_barcode_id', type: DataType.STRING})
    barcodeId: string;

    @Column({field: 'client_user_phone_number', type: DataType.STRING})
    phoneNumber: string;

    @Column({field: 'client_user_password', type: DataType.STRING})
    password: string;

    @AllowNull
    @Column({field: 'client_user_profile_image', type: DataType.STRING})
    profileImage: string;

    @Column({field: 'client_user_timezone', type: DataType.STRING})
    timeZone: string;

    @Column({field: 'is_active', type: DataType.TINYINT})
    isActive: boolean;

    @Column({field: 'user_2fa_enable', type: DataType.BOOLEAN, defaultValue: false})
    user2faEnable: boolean;

    @Column({field: 'user_sid', type: DataType.STRING, allowNull: true})
    userSid: string;

    @Column({field: 'user_slug', type: DataType.STRING})
    userSlug: string;

    @Column({field: 'is_first_time', type: DataType.BOOLEAN, defaultValue: true})
    isFirstTime: boolean;

    @BelongsToMany(() => ClientModel, () => UserClientPivotModel)
    clients: ClientModel[];

    @HasMany(() => UserAuthModel)
    userAuths: UserAuthModel[];

    @HasMany(() => UserClientPivotModel)
    userClientPivots: UserClientPivotModel[];


}
