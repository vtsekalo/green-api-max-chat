import type {
  DeleteNotificationResponse,
  GetStateInstanceResponse,
  GreenApiCredentials,
  GreenApiNotification,
  IncomingTextMessage,
  SendMessageResponse,
} from "../types/greenApi";


export class GreenApiError extends Error {
  status: number;
  payload: unknown;

  constructor(
    message: string,
    status: number,
    payload: unknown = null,
  ) {
    super(message);

    this.name = "GreenApiError";
    this.status = status;
    this.payload = payload;
  }
}



function normalizeApiUrl(apiUrl: string): string {
  return apiUrl
    .trim()
    .replace(/\/+$/, "");
}



function createInstanceUrl(
  credentials: GreenApiCredentials,
  method: string,
): string {

  const apiUrl =
    normalizeApiUrl(
      credentials.apiUrl,
    );


  const idInstance =
    encodeURIComponent(
      credentials.idInstance.trim(),
    );


  const apiTokenInstance =
    encodeURIComponent(
      credentials.apiTokenInstance.trim(),
    );


  return (
    `${apiUrl}` +
    `/waInstance${idInstance}` +
    `/${method}` +
    `/${apiTokenInstance}`
  );
}




async function parseResponseBody(
  response: Response,
): Promise<unknown | null> {

  const text =
    await response.text();


  if (!text.trim()) {
    return null;
  }


  try {

    return JSON.parse(text);

  } catch {

    return text;

  }
}




function getErrorMessage(
  status: number,
  payload: unknown,
): string {


  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }



  switch(status) {

    case 400:
      return "GREEN-API отклонил запрос.";

    case 401:
      return "Ошибка авторизации GREEN-API.";

    case 403:
      return "GREEN-API запретил операцию.";

    case 404:
      return "Метод GREEN-API не найден.";

    case 429:
      return "Превышен лимит запросов.";

    case 500:
      return "Ошибка сервера GREEN-API.";

    default:
      return `GREEN-API HTTP ошибка ${status}.`;

  }

}





async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T | null> {


  const response =
    await fetch(
      url,
      options,
    );


  const payload =
    await parseResponseBody(
      response,
    );



  /*
    408 в GREEN-API означает:
    новых сообщений нет.
    Для чата это нормальная ситуация.
  */

  if (
    response.status === 408
  ) {
    return null;
  }



  if (!response.ok) {


    console.error(
      "GREEN-API ERROR:",
      payload,
    );


    throw new GreenApiError(
      getErrorMessage(
        response.status,
        payload,
      ),
      response.status,
      payload,
    );

  }



  return payload as T | null;

}






export async function sendMessage(
  credentials: GreenApiCredentials,
  chatId: string,
  message: string,
  signal?: AbortSignal,
): Promise<SendMessageResponse> {


  const url =
    createInstanceUrl(
      credentials,
      "sendMessage",
    );



  const result =
    await request<SendMessageResponse>(
      url,
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/json",
        },

        body:JSON.stringify({
          chatId,
          message,
        }),

        signal,
      },
    );



  if(
    !result?.idMessage
  ) {

    throw new Error(
      "GREEN-API не вернул idMessage",
    );

  }



  return result;

}







export async function receiveNotification(
  credentials: GreenApiCredentials,
  receiveTimeout = 20,
  signal?: AbortSignal,
): Promise<GreenApiNotification | null> {


  const baseUrl =
    createInstanceUrl(
      credentials,
      "receiveNotification",
    );



  const url =
    `${baseUrl}?receiveTimeout=${receiveTimeout}`;



  return request<GreenApiNotification>(
    url,
    {
      method:"GET",
      signal,
    },
  );

}







export async function deleteNotification(
  credentials: GreenApiCredentials,
  receiptId:number,
  signal?:AbortSignal,
):Promise<DeleteNotificationResponse>{


  const baseUrl =
    createInstanceUrl(
      credentials,
      "deleteNotification",
    );


  const url =
    `${baseUrl}/${receiptId}`;



  const result =
    await request<DeleteNotificationResponse>(
      url,
      {
        method:"DELETE",
        signal,
      },
    );



  if(!result){

    throw new Error(
      "Пустой ответ при удалении уведомления",
    );

  }



  return result;

}







export function parseIncomingTextMessage(
  notification: GreenApiNotification,
): IncomingTextMessage | null {


  const body =
    notification.body;



  if(
    body.typeWebhook !==
    "incomingMessageReceived"
  ){
    return null;
  }



  if(
    body.messageData?.typeMessage !==
    "textMessage"
  ){
    return null;
  }



  const id =
    body.idMessage;


  const text =
    body.messageData
      .textMessageData
      ?.textMessage;



  const sender =
    body.senderData;



  if(
    !id ||
    typeof text !== "string" ||
    !sender
  ){
    return null;
  }



  return {

    id,

    text,

    timestamp:
      body.timestamp ??
      Date.now()/1000,

    chatId:
      sender.chatId ?? "",

    phone:
      String(
        sender.senderPhoneNumber ?? "",
      ),

    senderName:
      sender.senderContactName ||
      sender.senderName ||
      sender.chatName,

    direction:"incoming",

  };

}








export async function getStateInstance(
  credentials: GreenApiCredentials,
  signal?:AbortSignal,
):Promise<GetStateInstanceResponse>{


  const url =
    createInstanceUrl(
      credentials,
      "getStateInstance",
    );



  const result =
    await request<GetStateInstanceResponse>(
      url,
      {
        method:"GET",
        signal,
      },
    );



  if(
    !result?.stateInstance
  ){

    throw new Error(
      "Нет состояния инстанса",
    );

  }



  return result;

}