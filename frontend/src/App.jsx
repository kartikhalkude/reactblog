import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [id, setId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  
  // Search state (frontend filter only)
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all blogs from server
  const loadBlogs = () => {
    fetch('http://localhost:3000/')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error("Error loading blogs:", err));
  };

  // Auto-load blogs when component mounts
  useEffect(() => {
    loadBlogs();
  }, []);

  // Create Blog
  const handleCreate = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Blog created successfully');
      setTitle('');
      setContent('');
      loadBlogs();
    });
  };

  // Update Blog
  const handleUpdate = () => {
    fetch(`http://localhost:3000/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `title=${encodeURIComponent(updateTitle)}&content=${encodeURIComponent(updateContent)}`
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Blog updated successfully');
      setUpdateTitle('');
      setUpdateContent('');
      loadBlogs();
    });
  };

  // Delete Blog
  const handleDelete = () => {
    fetch(`http://localhost:3000/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Blog deleted successfully');
      setId('');
      loadBlogs();
    });
  };

  // Filter blogs locally based on searchQuery
  const filteredBlogs = blogs
    .map((blog, index) => ({ ...blog, originalIndex: index }))
    .filter(blog => {
      if (!blog) return false;
      const titleMatch = blog.title && blog.title.toLowerCase().includes(searchQuery.toLowerCase());
      const contentMatch = blog.content && blog.content.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || contentMatch;
    });

  return (
    <div className="container">
      <h1>Blog App (React + Vite)</h1>
      
      <h3>Create Blog</h3>
      <form onSubmit={handleCreate}>
         <input 
           type="text" 
           placeholder="Title" 
           value={title} 
           onChange={(e) => setTitle(e.target.value)} 
           required
         /><br/>
         <textarea 
           placeholder="Content" 
           value={content} 
           onChange={(e) => setContent(e.target.value)} 
           required
         /><br/>
         <button type="submit">Create Blog</button>
      </form>

      <hr/>

      <h3>Get All Blogs</h3>
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          className="search-input"
          placeholder="Search blogs in frontend (title or content)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        <button onClick={loadBlogs}>Refresh Manually</button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <strong>Blogs list (Auto-refreshes on actions):</strong>
        <pre>
          {JSON.stringify(filteredBlogs, null, 2)}
        </pre>
      </div>

      <hr/>

      <h3>Update / Delete Blog</h3>
      <div>
        <input 
          type="text" 
          placeholder="Blog Index (use 'originalIndex' from list: 0, 1, 2...)" 
          value={id} 
          onChange={(e) => setId(e.target.value)}
        /><br/>
        <input 
          type="text" 
          placeholder="New Title" 
          value={updateTitle} 
          onChange={(e) => setUpdateTitle(e.target.value)}
        /><br/>
        <input 
          type="text" 
          placeholder="New Content" 
          value={updateContent} 
          onChange={(e) => setUpdateContent(e.target.value)}
        /><br/>
        <button onClick={handleUpdate}>Update Blog</button>
        <button className="delete-btn" onClick={handleDelete}>Delete Blog</button>
      </div>
    </div>
  );
}

export default App;
