import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { socketContext } from "./SocketContext";
const App = () => {
    let { socket } = useContext(socketContext);

    return (
        <div>
            <h1>App Page</h1>
            <Outlet />
        </div>
    )
}

export default App;