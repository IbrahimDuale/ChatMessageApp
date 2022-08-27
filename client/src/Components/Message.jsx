import { Box, Typography } from "@mui/material";
import "./Message.css";
const Message = ({ fromSelf, name, content, date }) => {
    return (
        <Box sx={{ marginBottom: "2px" }}>
            <Box sx={{ display: "flex", }}>
                <Typography variant="subtitle1" component="h6"><span className="Message-name">{fromSelf ? "You" : name}</span> {" at " + date}</Typography>
            </Box>
            <Typography variant="body1">{content}</Typography>
        </Box >
    )
}

export default Message;