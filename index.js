const path = require('path'); // 경로 관련 기능이 있는 모듈
const express = require('express'); // express.js
const session = require('express-session'); // express.js에서 session을 저장할 수 있도록 만드는 모듈
const bodyParser = require('body-parser'); // HTTP BODY의 내용을 node에서 다룰 수 있도록 만드는 모듈
const app = express(); // express 서버 객체 생성

// Session 적용
app.use(session({
    secret: 'jetaS3creT',
    resave: false,
    saveUninitialized: true,
    cookie: {},
}));

// HTTP BODY 다룰 방식 적용
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: true,
}));

// CORS 보안 해제
app.all('*', (req, res, next) => {
    const origin = req.protocol + '://' + req.headers.host;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Root로 접속한 경우 청중 페이지로 이동
app.all('/', (req, res) => {
    res.redirect('/audience');
});
app.use('/audience', require('./routes/audience')); // 청중 페이지 라우터
app.use('/presenter', require('./routes/presenter')); // 발표자 페이지 라우터
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 라우팅

const server = require('http').createServer(app); // Server 생성

const io = require('socket.io')(server); // 생성된 express.js 서버에 socket 서버 추가
io.use((socket, next) => {
    session({ // socket에 Session 객체 추가
        secret: 'jetaS3creT',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })(socket.request, socket.request.res, next);
});
require('./io/io')(io); // 소켓 작동 방식 정의

server.listen(1215); // 1215 포트에서 서버 실행