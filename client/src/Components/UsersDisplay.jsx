
const UsersDisplay = ({ usersInfo }) => {
    let users = usersInfo.map((user) => {
        return <li key={user.id}>{user.name}</li>;
    })
    return <ul>{users}</ul>
}

export default UsersDisplay;