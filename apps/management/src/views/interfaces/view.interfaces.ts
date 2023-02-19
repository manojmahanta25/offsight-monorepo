import { UserGroupModel, ViewToGroupModel } from "@app/model";

export interface ViewUserGroupSetting {
  group_settings: ViewToGroupModel[];
  user_groups: UserGroupModel[];
}
