
export interface JwtPayloadInterface {
    userId: number
    username:string
    clientId:number
    email?:string
    userGroupId:number
    userTimeZone:string
    isUserMultiAccount: boolean,
    userGroupPermission:UserGroupPermissionInterface
}

export interface UserGroupPermissionInterface {
    loginAccessManagementTool:boolean
    loginAccessStartEndProductTool:boolean
    loginAccessAlert:boolean
    loginAccessHistory:boolean
    loginAccessAnalytics:boolean
    loginAccessReporting:boolean
    loginAccessDeleteSubmittedTask:boolean
    loginAccessEnablePauseProduction:boolean
    enablePasswordResetNoUserEmail:boolean
}