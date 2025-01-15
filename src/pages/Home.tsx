import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc, arrayUnion, updateDoc, addDoc } from 'firebase/firestore';
import { Post } from '../models/Post';
import { Container, Grid, Card, CardContent, Typography, Button, ListItem, Dialog, DialogTitle, TextField, List, ListItemText } from '@mui/material';
import { onAuthStateChanged, User } from 'firebase/auth';
import SearchBar from '../components/SearchBar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import Comment from './Comment';
import "../styles/global.css";

interface UserData {
    id: string;
    displayName: string;
    email: string;
}

interface CommentData {
    id: string;
    text: string;
    createdAt: Date;
    userId: string;
}

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<{ [key: string]: UserData }>({});
    const [open, setOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<CommentData[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchPosts(currentUser.uid);
                fetchUsers();
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchPosts = async (userId: string) => {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, where('userId', '==', userId));
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
        setPosts(postsList);
    };

    const fetchUsers = async () => {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.reduce((acc: { [key: string]: UserData }, doc) => {
            const data = doc.data();
            acc[doc.id] = { 
                id: doc.id,
                displayName: data.displayName || 'Unknown',
                email: data.email || 'Unknown'
            };
            return acc;
        }, {});
        setUsers(usersList);
    };

    const handleSearch = async (queryText: string) => {
        if (!queryText) {
            fetchPosts(user!.uid);
            return;
        }
        if (!user) {
            console.error("User is not logged in");
            return;
        }
        try {
            const postsCollection = collection(db, 'posts');
            const q = query(postsCollection, where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
            const searchResults = allPosts.filter(post => post.caption.includes(queryText));
            setPosts(searchResults);
        } catch (error) {
            console.error("Error searching posts: ", error);
        }
    };

    const handleDelete = async (postId: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            const postRef = doc(db, 'posts', postId);
            await deleteDoc(postRef);
            if (user) fetchPosts(user.uid);
        }
    };

    const handleLike = async (postId: string) => {
        if (user) {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, { likes: arrayUnion(user.uid) });
            fetchPosts(user.uid);
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (user && selectedPostId) {
            try {
                await addDoc(collection(db, "comments"), {
                    postId: selectedPostId,
                    text: comment,
                    createdAt: new Date(),
                    userId: user.uid
                });
                setComment("");
                fetchComments(selectedPostId);
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    const fetchComments = async (postId: string) => {
        const q = query(collection(db, "comments"), where('postId', '==', postId));
        const querySnapshot = await getDocs(q);
        const fetchedComments: CommentData[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<CommentData, 'createdAt'> & { createdAt: { toDate: () => Date} };
            return { id: doc.id, text: data.text, createdAt: data.createdAt.toDate(), userId: data.userId };
        });
        setComments(fetchedComments);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPostId(null);
    };

    return (
        <Container maxWidth="lg">
            <SearchBar onSearch={handleSearch} />
            <Grid container spacing={4} className="grid-container">
                {posts.map((post) => (
                    <Grid item component="div" key={post.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent className='card-content'>
                                <Typography gutterBottom variant="h5" component="div">
                                    {post.caption}
                                </Typography>
                                <Typography variant='body2' color='textSecondary'>
                                    Posted by: {users[post.userId]?.displayName || ''}
                                </Typography>
                                <div style={{ display: 'flex', alignItems: 'left', marginTop: '10px' }}>
                                    <Button onClick={() => handleLike(post.id)} style={{ color: 'red', marginLeft: '10px' }}>
                                        <FavoriteIcon style={{ marginRight: '5px' }} />
                                        {post.likes ? post.likes.length : 0}
                                    </Button>
                                    <Comment postId={post.id} />
                                    <Button onClick={() => handleDelete(post.id)}>
                                        <DeleteIcon style={{ marginLeft: '10px' }} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>コメントを追加</DialogTitle>
                <TextField label="コメントを追加" value={comment} fullWidth onChange={handleCommentChange} style={{ marginBottom: '10px' }} />
                <Button onClick={handleCommentSubmit} variant='contained' color='primary'>
                    送信
                </Button>
                <DialogTitle>コメント一覧</DialogTitle>
                <List>
                    {comments.map((comment) => (
                        <ListItem key={comment.id}>
                            <ListItemText primary={comment.text} secondary={comment.createdAt.toLocaleString()} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </Container>
    );
};

export default Home;