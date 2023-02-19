
export interface TokenAndRefresher{

    token:string

    refresherToken:string

    gotoMgt:boolean

    isUserMultiAccount:boolean
    isOtpScreen?: boolean
}
export interface ClientSelectInterface{
    clientId: number
    clientName: string
    clientLogo: string
    clientSquareLogo: string
    username: string
}

export interface ClientUserInterfaceWith2FA{
    clients: ClientSelectInterface[]

    isUserMultiAccount: boolean

    isOtpScreen?: boolean

    verifyToken: string
}

export interface SingleClientUserInterfaceWith2FA{
    clientId: number

    verifyToken?: string

    isUserMultiAccount: boolean

    isOtpScreen?: boolean
}

export interface VerifyTokenInterface{
    userId: number
    username: string,
    isUserMultiAccount: boolean
    isOtpVerified:boolean,
    is2faEnable: boolean,
}