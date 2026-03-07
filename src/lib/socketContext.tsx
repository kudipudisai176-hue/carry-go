import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ userId, children }: { userId?: string; children: ReactNode }) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            if (userId) {
                socket.emit("join", userId);
                console.log("Joined room:", userId);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    // Re-join room if userId changes
    useEffect(() => {
        if (userId && socketRef.current?.connected) {
            socketRef.current.emit("join", userId);
        }
    }, [userId]);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
