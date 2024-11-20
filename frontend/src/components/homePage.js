import React, { useState, useEffect } from 'react';

const Posts = () => {

    // Fetching data from an API
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://api/v1/posts')
           .then(response => response.json())
           .then(data => setPosts(data))
           .catch(error => console.error('Error:', error));
    }, []);

    console.log(posts);


  return (
    <div className="container">
       <div>
           {posts.map((post) => (
               <div key={post.id}>
                   <h2>{post.title}</h2>
                   <p>{post.body}</p>
               </div>
           ))}
       </div>
    </div>
  );
};

export default Posts;
