import { List, ListItem, Typography } from "@mui/material";

const UsersDisplay = ({ usersInfo }) => {
    let users = usersInfo.map((user) => {
        return <ListItem key={user.id}><Typography variant="body1" component="p" >{user.name}</Typography></ListItem>;
    })
    return (
        <List>
            {users}
        </List>
    )
}

export default UsersDisplay;