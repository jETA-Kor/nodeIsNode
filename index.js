const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(session({
    secret: 'jetaS3creT',
    resave: false,
    saveUninitialized: true,
    cookie: {},
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: true,
}));

app.all('*', (req, res, next) => {
    const origin = req.protocol + '://' + req.headers.host;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.all('/', (req, res) => {
    res.redirect('/audience');
});
app.use('/audience', require('./routes/audience'));
app.use('/presenter', require('./routes/presenter'));
app.use(express.static(path.join(__dirname, 'public')));

const server = require('http').createServer(app);

const io = require('socket.io')(server);
io.use((socket, next) => {
    session({
        secret: 'jetaS3creT',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })(socket.request, socket.request.res, next);
});
require('./io/io')(io);

server.listen(1215);