import {Inject, Injectable} from '@nestjs/common';
import {UserModel} from "@app/model/User/user.model";
import {UserClientPivotModel} from "@app/model/User/user-client-pivot.model";



@Injectable()
export class AuthService {
  constructor(){  }

  async getHello() {
  // const users = await this.userModel.sequelize.query(`SELECT client_user_id , client_user_username,GROUP_CONCAT(client_id,'-',client_user_type) as clientInfo,COUNT(client_user_username) from user group by client_user_username`,{ raw: true })
  //     for(const user of users[0]){
  //       const clients = user['clientInfo'].split(',');
  //       for(const client of clients){
  //           const clientInfo = client.split('-');
  //           const userClientPivot = await this.userClientPivotModel.findOne({
  //           where:{
  //               userId: user['client_user_id'],
  //               clientId: clientInfo[0],
  //               userType: clientInfo[1]
  //           }
  //           })
  //           if(!userClientPivot){
  //           await this.userClientPivotModel.create({
  //               userId: user['client_user_id'],
  //               clientId: clientInfo[0],
  //               userType: clientInfo[1]
  //           })
  //           }
  //       }
  //   }
   // await this.userModel.destroy({where:{
   //    id:{
   //      $notIn: users[0].map((user)=>user['client_user_id'])
   //    }
   //    }})
  }


  getIndex(): string {
    return '☢️Welcome to Auth microservice!! ☢';
  }
}
