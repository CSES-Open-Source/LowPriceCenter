import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { UserMessage } from "src/components/messages/types";

const testMessages: UserMessage[] = [
  {
    content: "Hello",
    sender: true,
    sendDate: new Date(),
  },
  {
    content: "My name is",
    sender: true,
    sendDate: new Date(),
  },
  {
    content: "greggg",
    sender: true,
    sendDate: new Date(),
  },
  {
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    sender: false,
    sendDate: new Date(),
  },
  {
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    sender: true,
    sendDate: new Date(),
  },
  {
    content: "🔥",
    sender: true,
    sendDate: new Date(),
  },
];
const chatBoxStyling = "rounded rounded-lg p-3 w-fit max-w-[75%] text-wrap break-all";
const senderStyling = chatBoxStyling + " ml-auto bg-default-teal";
const receiverStyling = chatBoxStyling + " bg-default-gray";

export function ChatBox(): ReactNode {
  const [messages, setMessages] = useState<UserMessage[]>(testMessages);
  const [input, setInput] = useState<string>();
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const generateMessageBox = (msg: UserMessage) => {
    return <div className={msg.sender ? senderStyling : receiverStyling}>{msg.content}</div>;
  };

  // Connect to websocket

  // Handle message update
  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input) return;
    setMessages((prev) => [...prev, { content: input, sender: true, sendDate: new Date() }]);
    setInput("");
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
        {messages.map((msg) => generateMessageBox(msg))}
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
