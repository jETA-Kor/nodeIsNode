var socket = io('/');
socket.emit('auth'); // 발표자로 인증 요청

var $frm_controller_prev = $('#frm_controller_prev');
var $frm_controller_next = $('#frm_controller_next');
var $chatlog = $('#chatlog');

$frm_controller_prev.click(function () { socket.emit('prevslide') }); // 이전 슬라이드 버튼을 클릭하면 이전 슬라이드 요청
$frm_controller_next.click(function () { socket.emit('nextslide') }); // 다음 슬라이드 버튼을 클릭하면 다음 슬라이드 요청

var addChatNode = function (chat) { // 메시지를 목록에 추가
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
socket.on('chatlist', function (list) { // 메시지 목록이 수신되면
    var i = 0;
    for (i = 0; i < list.length; i++) { // 순서대로 목록을 생성
        addChatNode(list[i]);
    }
});
socket.on('chat', function (chat) { // 새 메시지가 수신되면
    addChatNode(chat); // 목록 생성
}); 
socket.on('disconnect', function () { // 소켓 연결이 끊긴 경우
    location.reload(); // 페이지를 새로고침
});