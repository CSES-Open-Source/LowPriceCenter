import {
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SocketResponse, isOk } from "src/components/messages/api";
import { Conversation, UserMessage } from "src/components/messages/types";
import { ChatContext } from "src/utils/ChatProvider";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const chatBoxStyling = "rounded rounded-lg p-3 w-fit max-w-[75%] text-wrap break-all";
const senderStyling = chatBoxStyling + " ml-auto bg-default-teal";
const receiverStyling = chatBoxStyling + " bg-default-gray";

export function ChatBox({
  messages,
  setMessages,
  currConvo,
}: {
  messages: UserMessage[];
  setMessages: Dispatch<SetStateAction<UserMessage[]>>;
  currConvo: Conversation | null;
}): ReactNode {
  const { socket } = useContext(ChatContext);
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
    socket?.emit(
      "message:send",
      { conversationId: currConvo?._id, content: input },
      (response: SocketResponse) => {
        if (!isOk(response)) {
          alert(`unable to send message ${response.err?.msg}`);
        }
        setInput("");
      },
    );
    setMessages((prev) => [
      ...prev,
      { content: input, authorUid: user.uid, sender: true, updatedAt: new Date().toISOString() },
    ]);
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
  return (
    <div className="w-full h-full flex flex-col">
      <div ref={chatBoxRef} className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto no-scrollbar">
        {messages.map((msg, idx) => {
          return (
            <div className={msg.sender ? senderStyling : receiverStyling} key={idx}>
              {msg.content}
            </div>
          );
        })}
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
