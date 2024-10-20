require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to DB"))
.catch(err => console.error("Database connection error:", err));

const Todo = require('./models/Todo');

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new todo
app.post('/todo/new', async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text
        });
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a todo
app.delete('/todo/delete/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle completion status of a todo
app.get('/todo/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        todo.complete = !todo.complete;
        await todo.save();

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
