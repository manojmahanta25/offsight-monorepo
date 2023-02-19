import {Table, Column, DataType, Model, Default, HasMany, BelongsToMany} from "sequelize-typescript";
import {UserModel} from "../User/user.model";
import {UserClientPivotModel} from "../User/user-client-pivot.model";

@Table({tableName: 'client', timestamps: true, createdAt: 'client_registered_date', updatedAt: 'client_updated_date'})
export class ClientModel extends Model<ClientModel> {

    @Column({field: 'client_id', type: DataType.BIGINT, primaryKey: true, autoIncrement: true})
    id: number;

    @Column({field: 'client_name', type: DataType.STRING})
    name: string;

    @Column({field: 'client_email', type: DataType.STRING})
    email: string;

    @Column({field: 'client_phone', type: DataType.STRING, allowNull: true})
    phone: string;

    @Column({field: 'client_address', type: DataType.STRING, allowNull: true})
    address: string;

    @Column({field: 'client_city', type: DataType.STRING, allowNull: true})
    city: string;

    @Column({field: 'client_state', type: DataType.STRING, allowNull: true})
    state: string;

    @Column({field: 'client_country', type: DataType.STRING, allowNull: true})
    country: string;

    @Column({field: 'contact_person', type: DataType.STRING, allowNull: true})
    contactPerson: string;

    @Default(true)
    @Column({field: 'client_is_active', type: DataType.TINYINT, allowNull: true})
    status: boolean;

    @Column({field: 'client_user_username', type: DataType.STRING, allowNull: true})
    linkUsername: string;

    @Column({field: 'is_track', type: DataType.TINYINT, allowNull: true})
    isTrack: boolean;

    @Column({field: 'client_square_logo', type: DataType.STRING, allowNull: true})
    squareLogo: string;

    @Column({field: 'client_long_logo', type: DataType.STRING, allowNull: true})
    logo: string;

    @Column({field: 'client_is_active', type: DataType.TINYINT, allowNull: false, defaultValue: true})
    isActive: boolean;


    @BelongsToMany(()=> UserModel, ()=>UserClientPivotModel)
    users: UserModel[];

}
