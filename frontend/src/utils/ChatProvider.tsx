import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Dispatch, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { UserMessage } from "src/components/messages/types";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const ChatContext = createContext<{
  socket: Socket | undefined;
  messages: UserMessage[] | undefined;
  setMessages: Dispatch<React.SetStateAction<UserMessage[]>> | undefined;
}>({ socket: undefined, messages: undefined, setMessages: undefined });

export default function ChatProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const { app } = useContext(FirebaseContext);
  const [messages, setMessages] = useState<UserMessage[]>([]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      socket?.disconnect();
      if (!user) {
        setSocket((prev) => {
          prev?.disconnect();
          return undefined;
        });
        return;
      }

      const token = await user.getIdToken();
      const socketInstance = io(import.meta.env.VITE_SOCKET_BASE_URL, {
        auth: { token },
      });

      socketInstance.on("message:receive", (message) => {
        setMessages((prev) => {
          return [...prev, { ...message, sender: user.uid === message.authorUid }];
        });
      });

      setSocket(socketInstance);
    });

    return () => {
      unsubscribe();
    };
  }, [app]);
  return (
    <ChatContext.Provider value={{ socket, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext };
