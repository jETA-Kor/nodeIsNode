function Sockets() {
    this.list = []; // 소켓 배열
}
Sockets.prototype.add = function (socket) { // 소켓 추가
    this.list.push(socket);

    var self = this;
    socket.on('disconnect', function () {
        self.remove(socket);
    });
}
Sockets.prototype.remove = function (socket) { // 소켓 제거
    var i = this.list.indexOf(socket);
    if (i != -1) {
        this.list.splice(i, 1);
    }
}
Sockets.prototype.emit = function (name, data, except) { // 배열의 소켓에만 메시지 전송
    var i = this.list.length;
    while (i--) {
        if (this.list[i] != except) {
            this.list[i].emit(name, data)
        }
    }
}

module.exports = Sockets;
