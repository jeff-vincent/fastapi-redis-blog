import React, { useState, useEffect } from 'react';

const Posts = () => {
  // Fetching data from an API
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/metrics${id}`)
      .then((response) => response.json())
      .then((data) => setMetrics(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  console.log(metrics);

  return (
    <div className="bg-gray-100 min-h-screen py-12">
    </div>
  );
};

export default Posts;
