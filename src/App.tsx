// App.tsx

import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import { Container } from '@mui/material';
import Discovery from './pages/Discovery';
import Search from './pages/Search';
import Signup from './pages/Signup';
import LoginedUser from './pages/LoginedUser';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

const drawerWidth = 50;

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false)
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return(
      <div>Loading...</div>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
    <Router>
      <Navbar />
      <div style={{ flexGrow: 1, padding: '20px', marginLeft: drawerWidth }}>
        <Container>
          <LoginedUser />
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login"/>} />
            <Route path='/create-post' element={user ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path='/login' element={user ? <Navigate to="/" /> : <Login/>} />
            <Route path='/discovery' element={user ? <Discovery /> : <Navigate to="/login" />} />
            <Route path='/search' element={user ? <Search /> : <Navigate to="/login" />} />
            <Route path='/signup' element={user ? <Navigate to="/" /> : <Signup />} />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />}></Route>
          </Routes>
        </Container>
      </div>
    </Router>
  </div>
  );
  
}


export default App;