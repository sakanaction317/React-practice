// src/pages/Login.tsx

import React, {useState} from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleLogin = async(e:React.FormEvent) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            console.error("Login error: ", error);
            alert("Login failed Please check your email and password.");
        }
    };

    return(
        <Container>
            <Typography variant="h4" gutterBottom>Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField 
                    label="Email"
                    type="email"
                    value={email}
                    margin="normal"
                    fullWidth
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <TextField 
                    label="Password"
                    type="password"
                    value={password}
                    margin="normal"
                    fullWidth
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <Box mt={2} display='flex' justifyContent='center'> 
                    <Button type="submit" variant="contained" color="primary" sx={{ width: '100px' }}>
                        Login
                    </Button>
                </Box>
            </form>
            <Box mt={6} display="flex" justifyContent="center">
                <Typography >
                    <Link to="/signup" style={{ color: 'blue' }}>
                        新しいアカウントを作成
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;