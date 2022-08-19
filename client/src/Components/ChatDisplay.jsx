
const ChatDisplay = ({ usersInfo, messages }) => {
    //temporary display of users messages
    //to be changed later
    let messageDisplay = messages.map((message, i) => {
        return <li key={i}>{message.name} {message.timestamp.getTime()}: {message.content} </li>
    })

    return <ul>{messageDisplay}</ul>
}

export default ChatDisplay;