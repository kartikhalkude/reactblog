import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let blogs = [];

// GET route: triggered by $.get('http://localhost:3000/')
app.get('/', (req, res) => {
    res.json(blogs);
});

// POST route: triggered by $.post('http://localhost:3000/', { title, content })
app.post('/', (req, res) => {
    let newBlog = req.body;
    blogs.push(newBlog);
    res.json({ message: "Blog created successfully" });
});

// PUT route: triggered by $.ajax({ url: 'http://localhost:3000/' + id, type: 'PUT', data: { title, content } })
app.put('/:id', (req, res) => {
    let id = req.params.id;
    let updatedBlog = req.body;
    blogs[id] = updatedBlog;
    res.json({ message: "Blog updated successfully" });
});

// DELETE route: triggered by $.ajax({ url: 'http://localhost:3000/' + id, type: 'DELETE' })
app.delete('/:id', (req, res) => {
    let id = req.params.id;
    blogs.splice(id, 1);
    res.json({ message: "Blog deleted successfully" });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});