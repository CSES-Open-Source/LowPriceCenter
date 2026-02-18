import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Dispatch, ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { get } from "src/api/requests";
import { SocketResponse, isOk } from "src/components/messages/api";
import { Conversation, UserMessage } from "src/components/messages/types";
import { compareDate } from "src/utils/Date";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const ChatContext = createContext<{
  socket: Socket | undefined;
  messages: UserMessage[] | undefined;
  setMessages: Dispatch<React.SetStateAction<UserMessage[]>> | undefined;
  conversations: Conversation[] | undefined;
  setConversations: Dispatch<React.SetStateAction<Conversation[]>> | undefined;
  currConversationIdRef: React.MutableRefObject<string | undefined> | undefined;
  joinConversation: (id: string) => void;
  fetchConversations: () => void;
}>({
  socket: undefined,
  messages: undefined,
  setMessages: undefined,
  conversations: undefined,
  setConversations: undefined,
  currConversationIdRef: undefined,
  joinConversation: () => {},
  fetchConversations: () => {},
});

export default function ChatProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const { app, user } = useContext(FirebaseContext);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const currConversationIdRef = useRef<string | undefined>();

  const joinConversation = (id: string) => {
    socket?.emit("conversation:join", { id }, (response: SocketResponse) => {
      if (!isOk(response)) alert(`Could not find conversation: ${JSON.stringify(response.err)}`); // please please please remember to change this before final push
      if (!setMessages) return;
      setMessages(
        (response.body as UserMessage[]).map((msg) => {
          return { ...msg, sender: user?.uid === msg.authorUid };
        }),
      );
      currConversationIdRef.current = id;
    });
  };

  const fetchConversations = async () => {
    const res = await get(`/api/messages/conversation`);
    const convos = await res.json();
    const sortedConvos = convos.sort((a, b) => {
      const aCreated = a.lastMessage ? a.lastMessage.createdAt : a.createdAt;
      const bCreated = b.lastMessage ? b.lastMessage.createdAt : b.createdAt;
      return compareDate(aCreated, bCreated);
    });
    setConversations(sortedConvos || []);
  };

  useEffect(() => {
    if (!currConversationIdRef.current && conversations.length > 0) {
      joinConversation(conversations[0]._id);
    }
  }, [conversations]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      socket?.disconnect();
      if (!newUser) {
        setSocket((prev) => {
          prev?.disconnect();
          return undefined;
        });
        currConversationIdRef.current = undefined;
        return;
      }

      const token = await newUser.getIdToken();
      const socketInstance = io(import.meta.env.VITE_SOCKET_BASE_URL, {
        auth: { token },
      });

      socketInstance.on("message:receive", (message) => {
        if (currConversationIdRef.current === message.conversationId)
          setMessages((prev) => {
            return [...prev, { ...message, sender: newUser.uid === message.authorUid }];
          });

        setConversations((prev) => {
          if (!prev) return prev;

          const idx = prev.findIndex((c) => c._id === message.conversationId);
          if (idx === -1) return prev;

          const updatedConversation = {
            ...prev[idx],
            lastMessage: message,
          };

          // Move updated convo to top
          return [updatedConversation, ...prev.filter((_, i) => i !== idx)];
        });
      });

      
      fetchConversations();
      setSocket(socketInstance);
    });

    return () => {
      unsubscribe();
    };
  }, [app]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        messages,
        setMessages,
        conversations,
        setConversations,
        currConversationIdRef,
        joinConversation,
        fetchConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext };
