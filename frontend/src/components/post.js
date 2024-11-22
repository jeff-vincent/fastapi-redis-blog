import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Post = () => {
    const { title } = useParams();

    // Fetching data from an API
    const [post, setPost] = useState(null); // use null initially instead of an empty array

    useEffect(() => {
        // Avoiding multiple fetch calls by adding title as a dependency
        fetch(`http://localhost:8000/api/v1/post/${title}`)
         .then(response => response.json())
         .then(data => setPost(data))
         .catch(error => {
             console.error('Error:', error);
         });
    }, [title]); // Only run effect if the title changes

    if (!post) {
        return <div>Loading...</div>; // Show loading state until the post is fetched
    }

    return (
        <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8 border-b pb-4">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-lg text-gray-500">Author: <span className="font-medium text-gray-700">{post.author}</span></p>
            </div>
            <div className="prose prose-lg prose-gray">
            <p dangerouslySetInnerHTML={{ __html: post.body }} />
            </div>
        </div>
        </div>

    );
};

export default Post;
