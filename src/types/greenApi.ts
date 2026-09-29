export interface GreenApiCredentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface DeleteNotificationResponse {
  result: boolean;
  reason: string;
}

export interface GreenApiInstanceData {
  idInstance?: number;
  wid?: string;
  typeInstance?: string;
}

export interface GreenApiSenderData {
  chatId?: string;
  chatName?: string;
  chatType?: string;
  sender?: string;
  senderName?: string;
  senderType?: string;
  senderContactName?: string;
  senderPhoneNumber?: number | string;
}

export interface GreenApiTextMessageData {
  textMessage?: string;
}

export interface GreenApiMessageData {
  typeMessage?: string;
  textMessageData?: GreenApiTextMessageData;
  [key: string]: unknown;
}

export interface GreenApiWebhookBody {
  typeWebhook?: string;
  instanceData?: GreenApiInstanceData;
  timestamp?: number;
  idMessage?: string;
  senderData?: GreenApiSenderData;
  messageData?: GreenApiMessageData;
  [key: string]: unknown;
}

export interface GreenApiNotification {
  receiptId: number;
  body: GreenApiWebhookBody;
}

export interface IncomingTextMessage {
  id: string;
  text: string;
  timestamp: number;
  chatId: string;
  phone: string;
  senderName?: string;
  direction: "incoming";
}
export type GreenApiInstanceState =
  | "authorized"
  | "notAuthorized"
  | "blocked"
  | "starting";

export interface GetStateInstanceResponse {
  stateInstance: GreenApiInstanceState;
}