var socket = io('/');
socket.emit('auth');

var $frm_login_key = $('#frm_login_key');
var $frm_controller_prev = $('#frm_controller_prev');
var $frm_controller_next = $('#frm_controller_next');
var $chatlog = $('#chatlog');

$frm_login_key.keyup(function () {
    var key = this.value;
    if (key.length === 4) {
        $.ajax({
            type: 'POST',
            url: '/presenter',
            xhrFields: {
                withCredentials: true,
            },
            data: {
                key: key,
            },
        }).done(function () {
            location.reload();
        }).fail(function (xhr, err) {
            console.error(err);
            $frm_login_key.val('');
            window.alert('코드를 다시 확인하세요.');
        });
    }
});

$frm_controller_prev.click(function () { socket.emit('prevslide') });
$frm_controller_next.click(function () { socket.emit('nextslide') });

var addChatNode = function (chat) {
    var html = '';
    html += '<li>';
    html += '   <p>';
    html += '      <span class="name">' + chat.name + '</span>';
    html += '      <span class="date">' + new Date(chat.date).toTimeString().split(' ')[0] + '</span>';
    html += '      <span class="ip">(' + chat.ip + ')</span>';
    html += '   </p>';
    html += '   <p class="msg">' + chat.msg + '</p>';
    html += '</li>';

    $chatlog.prepend(html);
};
socket.on('chatlist', function (list) {
    var i = 0;
    for (i = 0; i < list.length; i++) {
        addChatNode(list[i]);
    }
});
socket.on('chat', function (chat) {
    addChatNode(chat);
}); 
socket.on('disconnect', function () {
    location.reload();
});