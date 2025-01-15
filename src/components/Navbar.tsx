
import { Link, useNavigate } from 'react-router-dom';
import {Drawer, List, ListItem, ListItemIcon, ListItemText, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const drawerWidth = 240;

const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = async() => {
        const confilmLogout = window.confirm("本当にログアウトしますか？");
        if (confilmLogout) {
            try {
                await signOut(auth);
                navigate("/login");
            } catch (error) {
                console.error("Error logging out:" , error);
            }
        };
    };

    return (
        <Drawer variant="permanent"
            sx={{ 
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
    >
        <List>
            <ListItem component={Link} to="/" sx={{ '&:visited': {color: 'inherit'} }}>
                <Typography variant='h5' style={{ padding: '20px' }}>
                    Instagram
                </Typography>                
            </ListItem>
            <ListItem component={Link} to="/" sx={{ '&:visited': {color: 'inherit'} }}>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="ホーム" />
            </ListItem>
            <ListItem component={Link} to="/search" sx={{ '&:visited': {color: 'inherit'} }}>
                <ListItemIcon>
                    <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="検索" />
            </ListItem>
            <ListItem component={Link} to="/discovery" sx={{ '&:visited': {color: 'inherit'} }}>
                <ListItemIcon>
                    <ExploreIcon />
                </ListItemIcon>
                <ListItemText primary="発見" />
            </ListItem>
            <ListItem component={Link} to="/create-post" sx={{ '&:visited': {color: 'inherit'} }}>
                <ListItemIcon>
                    <AddBoxIcon />
                </ListItemIcon>
                <ListItemText primary="作成" />
            </ListItem>
            <ListItem component={Link} to="/profile" sx={{ '&:visited': {color: 'inherit'} }}>
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="プロフィール" />
            </ListItem>
            <ListItem onClick={handleLogout} sx={{  }}>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="ログアウト"/>
            </ListItem>
        </List>
    </Drawer>
    );
    
}

export default Navbar;