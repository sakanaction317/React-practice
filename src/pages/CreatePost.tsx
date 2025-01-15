import React, {useState} from "react";
import { db, auth } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import "../styles/global.css";

const CreatePost = () => {

    const [caption, setCaption] = useState<string>('');
    const navigate = useNavigate();

    const handleUpload = async(e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) {
            alert('Please make sure you are logged in and haveselected an image');
            return;
        }
        if (caption.length > 30) {
            alert('Caption must be 30 words or less');
            return;
        }

        try {
            //Firebaseに登校を追加
            await addDoc(collection(db, 'posts'), {
                caption,
                userId: auth.currentUser!.uid,
                createdAt: new Date(),
            });

            alert('Post created succesfully');
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        }
    };

    return(
        <Container maxWidth="sm">
            <Paper elevation={3} className="create-post-container">
            <Typography variant="h4" gutterBottom>Create Post</Typography>
            <form onSubmit={handleUpload}>
                <TextField 
                    label="Caption"
                    fullWidth
                    value={caption}
                    margin="normal"
                    onChange={(e) => setCaption(e.target.value.substring(0, 30))}
                    required
                    />
                <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="submit-button"
                >
                    Post
                </Button>
            </form>
            </Paper>
            
        </Container>
    );
};

export default CreatePost;