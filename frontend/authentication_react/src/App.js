import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};


function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Routes>
        <Route exact path='/' element={<HomePage />} />

        <Route path='/auth' element={!authCtx.isLoggedIn?(<AuthPage/>):(<Navigate replace to={"/"} />)} />                  
        
        
        <Route path='/profile' element={
        <ProtectedRoute isLoggedIn={authCtx.isLoggedIn}>
          <UserProfile />
        </ProtectedRoute>
        
        } />
          
          
          
        <Route path='*' element={<Navigate to='/' />} />

      </Routes>
    </Layout>
  );
}

export default App;
