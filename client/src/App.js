import { Outlet, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
const App = () => {
    let navigate = useNavigate();
    return (
        <Box sx={{ flexGrow: 1, height: "100vh" }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                        <Button color="inherit" onClick={() => navigate("/")}>Chat Message App</Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
}

export default App;