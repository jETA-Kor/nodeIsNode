const Sockets = require('../modules/sockets');
const presenter = new Sockets();

const MAX_SLIDE = 37;
const progress = {
    slide: 0,
};
const chatlog = [];

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.emit('slide', progress.slide);

        socket.on('chat', (name, msg) => {
            const chat = {
                name: name,
                msg: msg,
                ip: socket.conn.remoteAddress.replace(/^::ffff:/gi, ''),
                date: new Date(),
            };
            
            presenter.emit('chat', chat);
            chatlog.push(chat);
        });

        socket.on('auth', () => {
            socket.request.session.isAuth = true;
            presenter.add(socket);

            socket.emit('chatlist', chatlog);
        });

        socket.on('prevslide', () => {
            if (!socket.request.session.isAuth) {
                return;
            }
            if (0 < progress.slide) {
                progress.slide--;
            }

            socket.broadcast.emit('slide', progress.slide);
        });
        socket.on('nextslide', () => {
            if (!socket.request.session.isAuth) {
                return;
            }
            if (progress.slide < MAX_SLIDE) {
                progress.slide++;
            }

            socket.broadcast.emit('slide', progress.slide);
        });
    });
};