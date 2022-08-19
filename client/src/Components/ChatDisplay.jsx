
const ChatDisplay = ({ usersInfo, messages }) => {
    //temporary display of users messages
    //to be changed later
    let messageDisplay = messages.map((message, i) => {
        return <div key={i}>{message.name} {message.timestamp.getTime()}: {message.content} </div>
    })

    return <div>{messageDisplay}</div>
}

export default ChatDisplay;