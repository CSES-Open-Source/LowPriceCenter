import { ReactNode, useEffect, useState } from "react";
import { get } from "src/api/requests";
import { ChatBox } from "src/components/messages/ChatBox";
import { Conversation } from "src/components/messages/types";

export function Messages(): ReactNode {
  const [conversations, setConversations] = useState<Conversation>();
  const fetchConversations = async () => {
    const res = await get(`/api/message/conversation`);
    const convos = await res.json();
    console.log(convos);
    setConversations(convos || []);
  };
  useEffect(() => {
    fetchConversations();
  }, []);
  return (
    <div className="w-full h-[80vh] font-rubik flex ">
      <div className="m-8 flex-1 flex flex-col rounded-3xl shadow-md shadow-default-teal">
        <div className="px-6 pt-4 text-[40px] h-[12%]">Messages:</div>
        <div className="flex flex-row h-[88%] border-t-2">
          <div className="w-1/5 border-r-2 h-full">{/*todo*/}</div>
          <div className="w-4/5 h-full">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}
