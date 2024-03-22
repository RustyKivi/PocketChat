const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const session = require('express-session');
const PocketBase = require('pocketbase/cjs')
var CONFIG = require('./config.json');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const pb = new PocketBase(CONFIG.Pocketbase.url || "127.0.0.1:8090");

app.use(session({
    secret: CONFIG.Server.secret || 'secret', 
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/pages'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.redirect('/login')
});
app.get('/login', (req, res) => {
    const ipAddress = req.socket.remoteAddress;
    res.render('login');
});
app.get('/signup', (req, res) => {
    const ipAddress = req.socket.remoteAddress;
    res.render('signup');
});
app.get('/chat', async(req, res) => {
    const messages = await pb.collection('messages').getList(1, 10, {});
    const ipAddress = req.socket.remoteAddress;
    res.render('chat', { messages });
});

// Socket
io.on('connection', (socket) => {
    const ipAddress = socket.handshake.address;
    socket.data.username = ipAddress;
    socket.data.id = "nqb93gfeju435u2";
    socket.on('chat message', (msg) => {
        message = {
            content:msg.content,
            sender:socket.data.username,
            time:getTimeString()
        };
        io.emit('chat message', message);
        if(CONFIG.Pocketbase.messages == true)saveMessage(socket.data.id,msg.content);
    });
});
async function saveMessage(senderid,content)
{
    const data = {
        "Sender": senderid,
        "Content": content
    };
    const record = await pb.collection('messages').create(data);
    console.log("Datasaved!");
}


// Server/Config
const PORT = CONFIG.Server.port || 3040;
let LOGMESSAGES = CONFIG.LogSettings.messages || false;

// Pocketbase/Config
let ISCONNECTED = CONFIG.Pocketbase.connected || false;
let MESSAGES = CONFIG.Pocketbase.messages || false;
let AUTH = CONFIG.Pocketbase.auth || false;
server.listen(PORT, () => {
    logServer();
});
function logServer()
{   
    console.clear();
    console.log(` `);
    console.log(`\x1b[31mSession: \x1b[4m${getTimeString()}\x1b[0m`);
    console.log(`┌─ Server: \x1b[33mRunning\x1b[0m`)
    console.log(`│   ├─ Port: \x1b[33m${PORT}\x1b[0m`);
    console.log(`│   ├─ Log: \x1b[33m${LOGMESSAGES}\x1b[0m`);
    console.log(`│   └─ Open: \x1b[33m${CONFIG.Server.open || false}\x1b[0m`)
    console.log("│")
    console.log(`├─ Links:\x1b[36m http://localhost:${PORT}\x1b[0m`)
    console.log(`│   ├─ Login:\x1b[36m http://localhost:${PORT}/login\x1b[0m`)
    console.log(`│   ├─ Register:\x1b[36m http://localhost:${PORT}/signup\x1b[0m`)
    console.log(`│   └─ Chat:\x1b[36m http://localhost:${PORT}/chat\x1b[0m`)
    console.log("│")
    console.log(`└─ Pocketbase is connected: \x1b[32m${ISCONNECTED}\x1b[0m`)
    if(ISCONNECTED)
    {   
        console.log(`    ├─ Admin UI: \x1b[32m${CONFIG.Pocketbase.url}/_/\x1b[0m`);
        console.log(`    ├─ Messages: \x1b[32m${MESSAGES}\x1b[0m`);
        console.log(`    └─ Auth: \x1b[32m${AUTH}\x1b[0m`)
    }
    console.log(` `);
}
function getTimeString()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const _time = `${hours}:${minutes}`;
    return _time;
}