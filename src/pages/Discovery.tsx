import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { Container, Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { Post } from "../models/Post";
import { collection, getDocs, query, orderBy, limit, arrayUnion, doc, updateDoc, getDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { onAuthStateChanged, User } from "firebase/auth";
import Comment from "./Comment";
import "../styles/global.css";

interface UserData {
    id: string;
    displayName: string;
    email: string;
}

const Discovery = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<{ [key: string]: UserData }>({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const fetchNewPosts = async () => {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('createdAt', 'desc'), limit(10));
        const postsSnapshot = await getDocs(q);
        const newPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), likes: doc.data().likes || [] })) as Post[];
        setPosts(newPosts);
        await fetchUsers();
    };

    const fetchPopularPosts = async () => {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('likes', 'desc'), limit(10));
        const postsSnapshot = await getDocs(q);
        const popularPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), likes: doc.data().likes || [] })) as Post[];
        setPosts(popularPosts);
        await fetchUsers();
    };

    const handleLike = async (postId: string) => {
        if (user && postId) {
            try {
                console.log(`Liking post with ID: ${postId}`); // デバッグ用ログ
                const postRef = doc(db, 'posts', postId);
                const postSnapshot = await getDoc(postRef);
                if (!postSnapshot.exists()) {
                    throw new Error("Post not found");
                }
                const likes = postSnapshot.data().likes || [];
                console.log('Current likes:', likes);
                await updateDoc(postRef, {
                    likes: arrayUnion(user.uid)
                });
                console.log(`Post liked successfully by user: ${user.uid}`); // デバッグ用ログ
                fetchNewPosts(); // いいねの数を更新した後に再度投稿を取得して表示
            } catch (error) {
                console.error("Error liking post: ", error); // エラーログ
            }
        } else {
            console.error("User or Post ID is undefined");
        }
    };

    const fetchUsers = async() => {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.reduce((acc: {[key: string]: UserData }, doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data() as UserData;
            acc[doc.id] = {
                id: doc.id,
                displayName: data.displayName || 'Unknown',
                email: data.email || 'Unknown' 
            };
            return acc;
        }, {});
        setUsers(usersList);
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item>
                    <Button 
                        onClick={fetchNewPosts} 
                        variant="outlined" 
                        sx={{
                            borderColor: 'gray',
                            color: 'gray',
                            '&:hover': {
                                borderColor: 'black',
                                color: 'black',
                                backgroundColor: 'transparent',
                            }
                        }}
                    >
                        新着投稿を確認
                    </Button>
                </Grid>
                <Grid item>
                    <Button 
                        onClick={fetchPopularPosts} 
                        variant="outlined" 
                        color= "inherit"
                        sx={{
                            borderColor: 'gray',
                            color: 'gray',
                            '&:hover': {
                                borderColor: 'black',
                                color: 'black',
                                backgroundColor: 'transparent',
                            }
                        }}
                    >
                        人気の投稿をチェック
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                {posts.map((post) => (
                    <Grid item key={post.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent className="card-content">
                                <Typography gutterBottom variant="h5" component="div" className="caption-text">
                                    {post.caption}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Posted by: {users[post.userId]?.displayName || 'Unknown User'}
                                </Typography>
                                <div style={{ display: 'flex', alignItems: 'left', marginTop: '10px' }}>
                                    <Button onClick={() => handleLike(post.id)} style={{ color: 'red', marginLeft: '10px' }}>
                                        <FavoriteIcon style={{ marginRight: '5px' }} />
                                        {post.likes ? post.likes.length : 0}
                                    </Button>
                                    <div className="comment-grid">
                                        <Comment postId={post.id}/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Discovery;
