import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles for the snow theme

const Editor = () => {
  const [editorContent, setEditorContent] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');

  const handleChange = (value) => {
    setEditorContent(value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
  };

  const generateId = () => {
    return Date.now() + Math.floor(Math.random() * 10000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create the payload for the request
    const payload = {
      body: editorContent,
      title: title,
      summary: summary,
      author: author,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      published: true,
    };

    // Send the editor content to the backend API as JSON
    fetch('http://localhost:8000/api/v1/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Setting Content-Type to JSON
      },
      body: JSON.stringify(payload), // Convert the payload to a JSON string
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON response
    })
    .then(data => console.log('Saved content:', data))
    .catch(error => console.error('Error:', error));

    // Log the editor content to the console for testing/debugging purposes
    console.log('Editor content:', editorContent);
    console.log('Title:', title);
    console.log('Author:', author);
    
    event.target.reset(); // Clear the form after submission
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Write a thang</h2>

        {/* Title and Author Inputs */}
        <div className="mb-6">
          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Title:</span>
            <input 
              type="text" 
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter the title of your post"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-semibold">Author:</span>
            <input 
              type="text" 
              value={author}
              onChange={handleAuthorChange}
              placeholder="Enter the author's name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-semibold">Summary:</span>
            <input 
              type="text" 
              value={summary}
              onChange={handleSummaryChange}
              placeholder="Enter a brief summary"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>
        </div>

        {/* ReactQuill Editor */}
        <div className="mb-8">
          <ReactQuill
            value={editorContent}
            onChange={handleChange}
            theme="snow"
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [ 'link', 'image', 'video', 'formula' ],          // add's image support
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean']                                         // remove formatting button
            ],
            }}
            className="bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        {/* Editor Content Preview */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Editor Content Preview:</h3>
          <pre className="text-gray-600 whitespace-pre-wrap">{editorContent}</pre>
        </div>

        {/* Submit Button */}
        <form onSubmit={handleSubmit} className="mt-4">
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Editor;
