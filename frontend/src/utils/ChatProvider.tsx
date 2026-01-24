import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const ChatContext = createContext<{
  socket: Socket | undefined;
}>({ socket: undefined });

export default function ChatProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const { app } = useContext(FirebaseContext);
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

      setSocket(socketInstance);
    });

    return () => unsubscribe();
  }, [app]);
  return <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>;
}

export { ChatContext };
