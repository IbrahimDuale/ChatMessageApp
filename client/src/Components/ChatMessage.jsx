import MessageForm from "./MessageForm";
import ChatDisplay from "./ChatDisplay";
import UsersDisplay from "./UsersDisplay";
import { Box, List, Paper, Typography, ListItem } from "@mui/material";

const ChatMessageStyles = {
    display: "flex",
    padding: "10px",
}

const ChatDisplayStyles = {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    width: "70vw",
}

const UserDisplayStyle = {
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    overflowY: "auto",
    flexGrow: 1,
}

const MembersStyle = {
    display: "flex",
    flexDirection: "column",
    height: "87vh",
    width: "20vw",
}

const ChatMessage = ({ users, messages, submitMessage, myId }) => {
    return (
        <Box sx={ChatMessageStyles}>
            <Box sx={ChatDisplayStyles}>
                <ChatDisplay messages={messages} userInfo={users} myId={myId} />
                <MessageForm submitMessage={submitMessage} />
            </Box>
            <Box sx={MembersStyle}>
                <Typography align="center" variant="h6" component="div">Members</Typography>
                <Box sx={UserDisplayStyle}>
                    <UsersDisplay usersInfo={users} />
                </Box>
            </Box>
        </Box>
    )
}

export default ChatMessage;
