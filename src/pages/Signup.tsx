// src/pages/Signup.tsx

import {useState} from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async() => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                displayName: displayName,
                email: email,
                createdAt: new Date(),
            });

            alert("Account created successfully!");
            navigate('/');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }else{
                setError("An unknown error occurred");
            }
        }
    };

    return(
        <Container maxWidth="sm">
            <Typography>
                Sign Up
            </Typography>
            <TextField 
                value={displayName}
                label="User Name"
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField 
                value={email}
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField 
                value={password}
                label="password"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}
            <Button variant="contained" color="primary" onClick={handleSignup}>
                Sign Up
            </Button>
        </Container>
    )
}

export default Signup;