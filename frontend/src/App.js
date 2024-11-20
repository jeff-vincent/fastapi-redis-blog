import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Posts from './components/homePage';

const App = () => {
  
  return (
    <Router>
      <div>
        <h1>Blog</h1>
        <Routes>
          <Route exact path="/" element={<Posts/>} />
          <Route exact path="/post/:id" element={<Posts/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;