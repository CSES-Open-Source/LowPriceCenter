import { FormEvent, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { SocketResponse, isOk } from "src/components/messages/api";
import { ChatContext } from "src/utils/ChatProvider";
import { formatDateMMDDYYHHMM } from "src/utils/Date";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const chatBoxStyling = "rounded rounded-lg p-3 w-fit max-w-[75%] text-wrap break-all";
const senderStyling = chatBoxStyling + " bg-default-teal";
const receiverStyling = chatBoxStyling + " bg-default-gray";

export function ChatBox(): ReactNode {
  const { socket, messages, conversations, currConversationIdRef } = useContext(ChatContext);
  const { user } = useContext(FirebaseContext);
  const [input, setInput] = useState<string>();
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  // Handle message update
  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user) return;
    if (!input) return;
    setInput("");
    socket?.emit(
      "message:send",
      { conversationId: currConversationIdRef?.current, content: input },
      (response: SocketResponse) => {
        if (!isOk(response)) {
          alert(`unable to send message ${response.err?.msg}`);
        }
      },
    );
  };
  const handleInputResize = async (e: FormEvent) => {
    const target = e.target as HTMLTextAreaElement;

    const maxHeight = 150;
    target.style.height = "auto";
    if (target.scrollHeight > maxHeight) {
      target.style.height = `${maxHeight}px`;
      target.style.overflowY = "auto";
    } else {
      target.style.height = `${target.scrollHeight}px`;
      target.style.overflowY = "hidden";
    }
  };

  if (conversations === undefined || conversations.length === 0) {
    return (
      <div className="flex w-full h-full items-center font-rubik">
        <div className="flex flex-col w-full text-gray-400">
          <div className="font-medium text-[40px] w-full text-center">
            Conversations start with discovery
          </div>
          <div className="font-small text-[32px] w-full text-center">
            Check out the marketplace and meet someone new! ✨
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div ref={chatBoxRef} className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto no-scrollbar">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => {
            const date = (
              <div className="p-3 transition-opacity duration-200 text-gray-400 opacity-0 group-hover:opacity-100 pl-auto">
                {formatDateMMDDYYHHMM(msg.updatedAt)}
              </div>
            );
            return (
              <div
                className={`flex group flex-row w-full ${msg.sender && "justify-end"}`}
                key={idx}
              >
                {msg.sender && date}
                <div className={msg.sender ? senderStyling : receiverStyling}>{msg.content}</div>
                {!msg.sender && date}
              </div>
            );
          })
        ) : (
          <div className="flex w-full h-full items-center font-rubik">
            <div className="flex flex-col w-full text-gray-400">
              <div className="font-medium text-[40px] w-full text-center">
                It&apos;s quiet here...
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t-2 flex-none max-h-[50%] h-fit w-full">
        <form onSubmit={handleSendMessage} className="flex flex-row">
          <textarea
            placeholder="Send Message..."
            className="p-3 flex-1 break-all text-wrap resize-none"
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleInputResize}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
                (e.target as HTMLTextAreaElement).style.height = "auto";
              }
            }}
          />
          <button
            type="submit"
            className="mx-8 my-1 flex-none hover:bg-default-teal w-10 h-10 outline-none rounded-[50%]"
          >
            {">"}
          </button>
        </form>
      </div>
    </div>
  );
}
