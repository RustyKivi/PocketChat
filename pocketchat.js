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
    if(CONFIG.LogSettings.request == true){logRequest('/login',true,'GET',ipAddress)}
    res.render('login');
});
app.get('/signup', (req, res) => {
    const ipAddress = req.socket.remoteAddress;
    if(CONFIG.LogSettings.request == true){logRequest('/sign',false,'GET',ipAddress)}
    res.render('signup');
});
app.get('/chat', (req, res) => {
    const ipAddress = req.socket.remoteAddress;
    if(CONFIG.LogSettings.request == true){logRequest('/chat',true,'GET',ipAddress)}
    res.render('chat');
});

// Socket
io.on('connection', (socket) => {
    const ipAddress = socket.handshake.headers["x-forwarded-for"].split(",")[0];
    socket.data.username = ipAddress;
    socket.on('chat message', (msg) => {
        logMessage(msg,ipAddress,)
        io.emit('chat message', msg);
    });
});


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
    console.log(`Session: ${getTimeString()}`);
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
function logMessage(content, sender,messageid)
{
    if(CONFIG.LogSettings.messages == false || LOGMESSAGES == false)return;
    const id = messageid || "Null";

    console.log(`┌─ Message : \x1b[33m${id}\x1b[0m`)
    console.log(`├── Sender: \x1b[33m${sender}\x1b[0m`);
    console.log(`├── Time: \x1b[33m${getTimeString()}\x1b[0m`);
    console.log(`└── Content: \x1b[33m${content}\x1b[0m`);
    console.log(` `);
}
function logRequest(url,success,type,IP)
{
    console.log(`┌─ ${type} Request: \x1b[33m${url}\x1b[0m`)
    if(!success){console.log(`├── Success?: \x1b[31m${success}\x1b[0m`);}else{console.log(`├── Success?: \x1b[32m${success}\x1b[0m`);}
    console.log(`├── Time: \x1b[33m${getTimeString()}\x1b[0m`);
    console.log(`└── IP: \x1b[33m${IP}\x1b[0m`);
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