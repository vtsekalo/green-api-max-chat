import "./ChatWindow.css";

import { useEffect, useRef, useState } from "react";

import {
  GreenApiError,
  sendMessage,
  receiveNotification,
  deleteNotification,
  parseIncomingTextMessage,
} from "../api/greenApi";

import type {
  GreenApiCredentials,
} from "../types/greenApi";


interface ChatWindowProps {
  credentials: GreenApiCredentials;
}


interface Message {
  id: string;
  text: string;
  direction: "incoming" | "outgoing";
}


function normalizePhone(phone: string): string {
  return phone
    .replace(/\D/g, "")
    .replace(/^8/, "7");
}


function phoneToChatId(phone: string): string {
  return `${normalizePhone(phone)}@c.us`;
}


export function ChatWindow({
  credentials,
}: ChatWindowProps) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [phone, setPhone] = useState("");
  const [chatId, setChatId] = useState("");
  const [text, setText] = useState("");

  const running = useRef(true);
  const messagesEndRef =
    useRef<HTMLDivElement>(null);



  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);



  useEffect(() => {

    running.current = true;


    async function listen() {

      while (running.current) {

        try {

          const notification =
            await receiveNotification(
              credentials,
              20,
            );


          if (!notification) {
            continue;
          }


          if (notification.receiptId) {

            await deleteNotification(
              credentials,
              notification.receiptId,
            );

          }


          const incoming =
            parseIncomingTextMessage(
              notification,
            );


          if (incoming) {

            setMessages((prev) => [
              ...prev,
              {
                id: incoming.id,
                text: incoming.text,
                direction: "incoming",
              },
            ]);

          }


        } catch(error) {


          if (
            error instanceof GreenApiError &&
            error.status === 408
          ) {
            continue;
          }


          console.error(
            "Ошибка получения:",
            error,
          );

        }

      }

    }


    listen();


    return () => {
      running.current = false;
    };


  }, [credentials]);





  function createChat() {

    const id =
      phoneToChatId(phone);


    setChatId(id);

  }





  async function handleSend() {


    if (!chatId || !text.trim()) {
      return;
    }


    const message =
      text.trim();


    try {


      await sendMessage(
        credentials,
        chatId,
        message,
      );


      setMessages((prev)=>[
        ...prev,
        {
          id: crypto.randomUUID(),
          text: message,
          direction:"outgoing",
        },
      ]);


      setText("");


    } catch(error){

      console.error(
        "Ошибка отправки:",
        error,
      );

    }

  }





  return (

<div className="chat">


<div className="chat-header">

<h2>
MAX
</h2>


<div>
<span
style={{
color:"#00c853",
fontSize:18,
}}
>
●
</span>

{" "}В сети

</div>



<input
className="chat-input"

value={phone}

onChange={(e)=>
setPhone(e.target.value)
}

onBlur={createChat}

placeholder="+7 900 000 00 00"
/>


</div>





<div className="messages">


{
messages.map((message)=>(

<div
key={message.id}

className={
`message ${message.direction}`
}
>

{message.text}


</div>


))

}


<div ref={messagesEndRef}/>


</div>






<div className="input-area">


<input

value={text}

onChange={(e)=>
setText(e.target.value)
}

placeholder="Сообщение"

/>



<button
onClick={handleSend}
>

➤

</button>


</div>



</div>


  );

}