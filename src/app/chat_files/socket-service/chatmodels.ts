export class MessageProp {
    data: string;
    userName: string;
    isSent = false;
    senderId: string;
    msgType: string;
    url: string;
    timestamp:string;
    attachmentType: string;
    isRead:boolean

  }
  
  export class ChatHistoryMessage {
    userName: string;
    data: string;
    senderId: string;
    msgType: string;
    url: string;
    attachmentType: string;
    isRead:boolean

  }
  
  export class NewMessage {
    grpId: string;
    data: string;
    username: string;
    senderId: string;
    receiverIds: string;
    msgType: string;
    url: string;
    attachmentType: string;
    isRead:boolean
  }
  
  export class JoinGroupResult {
    isValidGroup: boolean;
    groupId: string;
  }
  
  export class ChatHistoryResult {
    groupName: string;
    msgCount: number;
    userIdCount: number;
    messages: ChatHistoryMessage[];
  }


  export enum ApiReturnEnum {
    Successful = 0,
    SuccessfulNoContent = 1,
    ErrorOccurred = -1
}
  