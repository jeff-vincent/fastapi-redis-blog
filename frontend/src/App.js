import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Posts from './components/posts';
import Post from './components/post';
import Editor from './components/textEditor';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  // Simple authentication state, replace this with real authentication
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Mock login function for demonstration, replace with real authentication logic
  const login = (password) => {
    if (password === "yourPassword") {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Posts />} />
          <Route exact path="/post/:title" element={<Post />} />
          <Route 
            exact 
            path="/create" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Editor />
              </ProtectedRoute>
            } 
          />
        </Routes>

        {/* Temporary login button for demonstration purposes */}
        {!isAuthenticated && (
          <div>
            <button onClick={() => login(prompt('Enter password:'))}>
              Login
            </button>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
