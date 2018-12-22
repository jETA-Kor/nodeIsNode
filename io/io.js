const Sockets = require('../modules/sockets'); // 발표자의 소켓에만 broadcasting 하기 위한 모듈
const presenter = new Sockets(); // 발표자 socket을 담을 객체 생성

const MAX_SLIDE = 37; // 최대 슬라이드 수 정의
const progress = { // 현재 진행 상태를 담을 객체 정의
    slide: 0,
};
const chatlog = []; // 청중으로부터 도착한 메시지를 담을 배열

module.exports = (io) => { // 소켓 작동 방식 정의
    io.on('connection', (socket) => { // 새 연결이 발생한 경우
        socket.emit('slide', progress.slide); // 해당 소켓에 현재 진행 슬라이드 전송

        socket.on('chat', (name, msg) => { // 소켓으로부터 메시지가 도착한 경우
            const chat = { // 메시지 객체 생성
                name: name,
                msg: msg,
                ip: socket.conn.remoteAddress.replace(/^::ffff:/gi, ''), // 보낸 청중의 IP를 담는다
                date: new Date(), // 메시지 도착 일시를 담는다
            };
            
            presenter.emit('chat', chat); // 발표자에게 새 메시지 전송
            chatlog.push(chat); // 메시지 배열에 메시지 추가
        });

        socket.on('auth', () => { // 발표자로 인증 요청한 경우
            socket.request.session.isAuth = true; // 세션에 인증 여부 추가
            presenter.add(socket); // 발표자 배열에 소켓 추가

            socket.emit('chatlist', chatlog); // 지금까지의 메시지 배열 전송
        });

        socket.on('prevslide', () => { // 이전 슬라이드 표시 요청이 들어온 경우
            if (!socket.request.session.isAuth) { // 인증 여부 확인
                return; // 인증되지 않은 경우 요청 무시
            }
            if (0 < progress.slide) { // 이전 슬라이드로 변경
                progress.slide--;
            }

            socket.broadcast.emit('slide', progress.slide); // 모든 소켓에 현재 슬라이드 전송
        });
        socket.on('nextslide', () => { // 다음 슬라이드 표시 요청이 들어온 경우
            if (!socket.request.session.isAuth) { // 인증 여부 확인
                return; // 인증되지 않은 경우 요청 무시
            }
            if (progress.slide < MAX_SLIDE) { // 다음 슬라이드로 변경
                progress.slide++;
            }

            socket.broadcast.emit('slide', progress.slide); // 모든 소켓에 현재 슬라이드 전송
        });
    });
};