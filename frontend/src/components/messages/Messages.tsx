import { ReactNode, useContext } from "react";
import { ChatBox } from "src/components/messages/ChatBox";
import { Conversation } from "src/components/messages/types";
import { ChatContext } from "src/utils/ChatProvider";
import { formatDateMMDDYY } from "src/utils/Date";
import { FirebaseContext } from "src/utils/FirebaseProvider";

type ConvoCardProps = {
  convo: Conversation;
};

export function Messages(): ReactNode {
  const { conversations, currConversationIdRef, joinConversation } = useContext(ChatContext);
  const { user } = useContext(FirebaseContext);
  const loading = conversations === undefined;

  function ConvoCard({ convo }: ConvoCardProps): ReactNode {
    const participants = convo.participantsPopulated.filter(
      (item) => item.displayName !== user?.displayName,
    );
    return (
      <button
        className={`w-full text-left flex flex-row p-8 border-b-2 hover:bg-default-gray ${currConversationIdRef?.current === convo._id ? "bg-default-gray" : ""}`}
        onClick={() => joinConversation(convo._id)}
      >
        <div className="flex flex-col min-w-0">
          <div className="text-[32px] font-medium leading-tight">
            {participants.length > 0
              ? participants.map((p) => p.displayName).join(", ")
              : user?.displayName}
          </div>
          <div className="text-gray-500 truncate text-[16px] font-medium">
            {convo.lastMessage
              ? formatDateMMDDYY(convo.lastMessage.updatedAt) + " " + convo.lastMessage.content
              : " "
            }
            
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="w-full h-[80vh] font-rubik flex ">
      <div className="m-8 flex-1 flex flex-col rounded-3xl shadow-md shadow-default-teal min-w-0">
        <div className="px-6 pt-4 text-[40px] h-[12%] font-medium">{`Messages${loading ? ": loading..." : ""}`}</div>
        <div className="flex flex-row h-[88%] border-t-2">
          <div className="w-1/4 border-r-2 h-full overflow-hidden">
            {conversations?.map((convo) => {
              return <ConvoCard convo={convo} key={convo._id} />;
            })}
          </div>
          <div className="w-3/4 h-full">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}
