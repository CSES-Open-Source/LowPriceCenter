import { ReactNode, useContext, useEffect, useState } from "react";
import { get } from "src/api/requests";
import { ChatBox } from "src/components/messages/ChatBox";
import { SocketResponse, isOk } from "src/components/messages/api";
import { Conversation, UserMessage } from "src/components/messages/types";
import { ChatContext } from "src/utils/ChatProvider";
import { formatDateMMDDYY } from "src/utils/Date";
import { FirebaseContext } from "src/utils/FirebaseProvider";

type ConvoCardProps = {
  convo: Conversation;
};

export function Messages(): ReactNode {
  const { socket } = useContext(ChatContext);
  const { user } = useContext(FirebaseContext);
  const [conversations, setConversations] = useState<Conversation[]>();
  const [currConvo, setCurrConvo] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<UserMessage[]>([]);

  const joinConversation = (convo: Conversation) => {
    setLoading(true);
    socket?.emit("conversation:join", { id: convo._id }, (response: SocketResponse) => {
      if (!isOk(response)) alert(`Could not find conversation: ${response.err}`); // please please please remember to change this before final push

      setMessages(
        (response.body as UserMessage[]).map((msg) => {
          return { ...msg, sender: user?.uid === msg.authorUid };
        }),
      );
      setCurrConvo(convo);
      setLoading(false);
    });
  };

  function ConvoCard({ convo }: ConvoCardProps): ReactNode {
    const participants = convo.participants.filter(
      (item) => item.displayName !== user?.displayName,
    );
    return (
      <button
        className={`text-left flex flex-row p-3 border-b-2 w-full hover:bg-default-gray ${currConvo?._id === convo._id ? "bg-default-gray" : ""}`}
        onClick={() => joinConversation(convo)}
      >
        <div className="flex flex-col w-full">
          <div className="text-lg font-bold w-full">
            {participants.length > 0
              ? participants.map((p) => p.displayName).join(", ")
              : user?.displayName}
          </div>
          <div className="text-gray-500 truncate w-full">
            {convo.lastMessage
              ? formatDateMMDDYY(convo.lastMessage.updatedAt) + " " + convo.lastMessage.content
              : " "}
          </div>
        </div>
      </button>
    );
  }

  const fetchConversations = async () => {
    const res = await get(`/api/message/conversation`);
    const convos = await res.json();
    setConversations(convos || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchConversations();
  }, []);
  useEffect(() => {
    if (conversations) joinConversation(conversations[0]);
  }, [conversations]);

  return (
    <div className="w-full h-[80vh] font-rubik flex ">
      <div className="m-8 flex-1 flex flex-col rounded-3xl shadow-md shadow-default-teal">
        <div className="px-6 pt-4 text-[40px] h-[12%] font-bold">{`Messages${loading ? ": loading..." : ""}`}</div>
        <div className="flex flex-row h-[88%] border-t-2">
          <div className="w-1/4 border-r-2 h-full ">
            {conversations?.map((convo) => {
              return <ConvoCard convo={convo} key={convo._id} />;
            })}
          </div>
          <div className="w-3/4 h-full">
            <ChatBox messages={messages} setMessages={setMessages} currConvo={currConvo} />
          </div>
        </div>
      </div>
    </div>
  );
}
