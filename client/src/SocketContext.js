import socket from "./socket";
import { createContext } from "react";

const socketContext = createContext(null);

const SocketContext = ({ children }) => {


    return (
        <socketContext.Provider value={{ socket }}>
            {children};
        </socketContext.Provider>
    )
}

export default SocketContext;
export { socketContext };