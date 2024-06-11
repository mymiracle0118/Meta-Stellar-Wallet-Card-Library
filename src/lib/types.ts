





//ASSETS ---------------------------------------------------------------------------------------------------------------------------------------
//SnapAssets these are assets as read from the horizion server on xlm
export type SnapAsset = {
    balance: string,
    limit: string,
    buying_liabilities: string,
    selling_liabilities: string,
    last_modified_ledger?: number,
    is_authorized?: boolean,
    is_authorized_to_maintain_liabilites?: boolean,
    asset_type: "credit_alphanum4" | "native" | "credit_alphanum12",
    asset_issuer?: string,
    asset_code: string,
    is_clawback_enabled?: boolean,
}


//these are assets that have been converted to a more readable format. this is how they are read from the stellarExpert endpoint
export type DispAsset = {
    image:string, 
    asset:string|undefined, 
    code:string, 
    domain:string, 
    score:number, 
    supply:number | string,
    price?:Array<number[]> | undefined,
    balance?:string, 
    limit?:string
}

//special display asset for the native xlm
export const xlm_display:DispAsset = {
    image:"https://upload.wikimedia.org/wikipedia/commons/5/56/Stellar_Symbol.png", 
    asset:"native", 
    code:"XLM", 
    domain:"stellar.org", 
    score:10, 
    supply:"28271090270"
}


//special type that includes a liquidity pool id optionally
export interface NativeBalance{
    balance:string,
    liquidity_pool_id?:string,
    limit: string,
    buying_liabilites: string,
    selling_liabilites: string,
    sponser?: string,
    last_modified_ledger: number,
    is_authorized: boolean,
    is_authorized_to_maintain_liabilites: boolean,
    is_clawback_enabled: boolean,
    asset_type: "native",
    asset_issuer: "native"
    asset_code: "XLM"
}

//special type that includes a liquidity pool id optionally 
export interface AssetBalance{
    balance:string, //number
    liquidity_pool_id?:string, //number
    limit: string, //number
    buying_liabilites: string, //number
    selling_liabilites: string, //number
    sponser?: string, //address
    last_modified_ledger: number,
    is_authorized: boolean,
    is_authorized_to_maintain_liabilites: boolean,
    is_clawback_enabled: boolean,
    asset_type: "credit_alphanum4"|"credit_alphanum12"
    asset_code: string,
    asset_issuer: string, //address
}



export const emptyNativeBalance:SnapAsset = {
    balance:"0",
    limit: "Infinity",
    buying_liabilities: "0",
    selling_liabilities: "0",
    last_modified_ledger: Date.now(),
    is_authorized: true,
    is_authorized_to_maintain_liabilites: true,
    is_clawback_enabled: false,
    asset_type: "native",
    asset_issuer: "native",
    asset_code: "XLM"
}


// END ASSETS ---------------------------------------------------------------------------------------------------------------------------------------

//ACCOUNTS ---------------------------------------------------------------------------------------------------------------------------------------
export interface walletInfo{
    name:string,
    currentAddress:string,
    mainnetAssets?: SnapAsset[],
    testnetAssets?: SnapAsset[],
    accounts: Array<{name:String, address:String}>
    mainnetXLMBalance: string,
    testnetXLMBalance: string,
}

export interface user{
    id:string,
    fName?:string,
    lName?:string,
    username:string,
    email:string,
    dataConesent:boolean, //false by default
    profilePic?:string,
    walletInfo:walletInfo,
    posts?:Array<string>,
    friends?:Array<string>,
    chats?:Array<string>,
}


// END ACCOUNTS ---------------------------------------------------------------------------------------------------------------------------------------

//Social ---------------------------------------------------------------------------------------------------------------------------------------

export interface post{
    id:string,
    type:"text"|"image"|"video"|"nft"|"token",
    text?:string,
    url?:string,
    title?:string,
    posterId:string,
    likes:string[], //array of user ids
    comments:comment[],
}

export interface comment{
    id:string,
    text:string,
    posterId:string,
    likes:string[], //array of user ids
    timestamp:Date,
}

export interface conversation{
    id:string,
    members:string[], //array of user ids
    messages:message[],
    createdTimestamp:Date,
    creator:string, //user id
}

export interface message{  
    senderId:string, //user id
    receiverId:string, //user id or conversation id
    text:string,
    timestamp: Date,
    img?:string,
}