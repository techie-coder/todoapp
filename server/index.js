const express = require('express');
const app = express();
const PORT = 3000;

const jwt = require('jsonwebtoken');
const { auth } = require('./middleware');
const JWT_SECRET = "secret";

const USERS = [];
let user_id_counter = 1;

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

const TODOS = [];
let todos_counter = 1;

const ORGS = [];


app.get('/', (req, res) => {
    res.send("Hello World!");
    });


app.get('/todos',async  (req, res) => {
    try{
        await Todo.find()
        .then((result) => {
            res.send(result);
        })
    }
    catch(err){
        res.send("error fetching todos");
    }
});


app.post('/signup', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    const user = USERS.find(x => x.username === username);

    if(user){
        return res.status(483).json({msg: "User already exists"});
}

    USERS.push({
        id: user_id_counter++,
        username: username,
        password: password
        });

    return res.json({msg: "User signed up!"});
});


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = USERS.find(x => x.username === username);

    if(!user){
        return res.status(483).json({msg: "User does not exist"});
        }

    if(user.password !== password){
        return res.status(403).json({msg: "Password does not match"});
        }

    const token = jwt.sign({
        id: user.id},
        JWT_SECRET);

    return res.json(token);

});


app.post('/add-todo', auth, async  (req, res) => {
    try{
    const { title, body, status, deadline } = req.body;
    const user = req.user;

    const todo = new Todo({
        userId: user.id,
        title,
        body,
        status,
        deadline
    });

    await todo.save()
    return res.status(200).json({msg: "Todo created successfully!"});
    }
    catch(err){
        return res.status(483).json({msg: "Failed to create todo!"})
    }

});


app.post('/sample', (req, res) => {
    const todo = new Todo({
        userId: "1",
        title: "Drink water",
        body: "Don't forget to drink water",
        status: "pending",
        dead
    })
});

app.delete('/delToDo', auth, (req, res) => {
    const content = req.body.content;
    const initialLength = TODOS.length;
    TODOS = TODOS.filter(todo => !(x => x.content === content && x.userId === req.userId));

    if(TODOS.length < initialLength){
        return res.json({msg: "Todo deleted"});
    }else{
        return res.json({msg: "Todo not found"});
    }
});





app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
