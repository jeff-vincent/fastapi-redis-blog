import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Posts = () => {
  // Fetching data from an API
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  console.log(posts);

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            return post.redirect_url ? (
              <Link
                to={post.redirect_url}
                key={post.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer block"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
                <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.summary }} />
              </Link>
            ) : (
              <Link
                to={`/post/${post.id}`}
                key={post.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer block"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
                <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.summary }} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};  

export default Posts;
