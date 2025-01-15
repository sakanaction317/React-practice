//src/pages/LoginedUser

import {useState, useEffect } from "react";
import { Typography, Box, Link } from "@mui/material";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const LoginedUser = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect (() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }else{
                setCurrentUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleProfile = () => {
        navigate("/profile");
    };

    return(
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
            <Link onClick={handleProfile} style={{ color: 'inherit',  cursor: 'pointer', textDecoration: 'none' }}>
                <Box display="flex" alignItems="center">
                    <AccountCircleIcon style={{ fontSize: 30 }}/>
                    <Typography variant="h5" component="span" >
                        : {currentUser?.displayName || 'Anonymous'}
                    </Typography>
                </Box>
            </Link>
        </Box>
    )

}

export default LoginedUser;