import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Rooms from "./Components/Rooms";
import App from "./App";
import SocketContext from "./SocketContext";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<SocketContext><App /></SocketContext>}>
                <Route index element={<Login />} />
                <Route path=":roomName" element={<Rooms />} />
            </Route>
        </Routes>
    </BrowserRouter>
);