var socket = io('/');

var $frm_msg_name = $('#frm_msg_name');
var $frm_msg_msg = $('#frm_msg_msg');
var $frm_msg_submit = $('#frm_msg_submit');
var $article = $('article');

var sendMsg = function () { // 메시지 전송
    socket.emit('chat', $frm_msg_name.val(), $frm_msg_msg.val()); // 이름과 메시지를 서버로 전송
    $frm_msg_msg.val(''); // 메시지칸 비우기
};
$frm_msg_submit.click(sendMsg); // 전송 버튼을 클릭하면 메시지 전송 함수 실행
$frm_msg_msg.keydown(function (e) {
    if (e.which === 13) { // 키보드의 Enter 버튼을 누르면 메시지 전송 함수 실행
        sendMsg();
    }
});

socket.on('slide', function (slide) { // 새 슬라이드 번호가 도착하면
    $article.fadeOut('slow'); // 모두 FadeOut 하면서
    $article.eq(slide).fadeIn(); // 지정된 슬라이드는 FadeIn
});

var detectOs = function () { // OS 감지
    var str = navigator.platform.toLowerCase(); // 브라우저의 플랫폼을 불러옴

    if (-1 < str.indexOf('mac')) { // 플랫폼 문자열에 mac이 있으면 MacOS
        return 'mac';
    }
    
    if (-1 < str.indexOf('linux')) { // 플랫폼 문자열에 linux가 있으면 Linux 계열
        return 'linux';
    }

    return 'windows'; // 기타는 Windows로 간주
};
var setInstaller = function () { // 설치 프로그램 슬라이드 변경
    var os = detectOs(); // OS를 받아온 후
    
    var $installPrimary = $('#install_primary');
    var $installer = $('#install_' + os);

    $installPrimary.append($installer); // 청중의 PC에 맞는 설치 링크를 가장 위로 이동
};
setInstaller();
