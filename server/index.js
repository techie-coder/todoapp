const express = require('express');
const app = express();
const PORT = 3000;

const jwt = require('jsonwebtoken');
const { auth } = require('./middleware');
const JWT_SECRET = "secret";
const bcrypt = require('bcrypt');

const cors = require('cors');
app.use(cors())

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(jsonParser);


const mongoose = require('mongoose');
const dbURI = "mongodb+srv://s4swata:Hah5IwBHP1CoE7vk@todo.dajcr.mongodb.net/?retryWrites=true&w=majority&appName=todo"
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        console.log("connected to db")
    })
    .catch((err) => console.log(err))


const Todo = require('./models/todos.js');

const User = require('./models/user.js');


app.get('/', (req, res) => {
    res.send("Hello World!");
    });


app.get('/todos', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: "Error fetching todos" });
    }
});


app.post('/signup', async (req, res) => {
    try {
        const { email, password, organization } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            passwordHash: hashedPassword,
            organization
        });

        await newUser.save();
        res.status(201).json({ msg: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error creating user" });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Login error" });
    }
});

app.post('/add-todo', auth, async (req, res) => {
    try {
        const { title, body, status, deadline } = req.body;
        const todo = new Todo({
            userId: req.user.id,
            title,
            body,
            status,
            deadline
        });

        await todo.save();
        res.status(201).json({ msg: "Todo created successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to create todo" });
    }
});

app.delete('/delete-todo/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ msg: "Todo not found" });
        }
        res.json({ msg: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting todo" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
