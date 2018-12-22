var $frm_login_key = $('#frm_login_key');

$frm_login_key.keyup(function() {
    var key = this.value;
    if (key.length === 4) { // 4개의 숫자를 입력했다면
        $.ajax({ // 서버에 인증 요청
            type: 'POST',
            url: '/presenter',
            xhrFields: {
                withCredentials: true, // CORS 관련 처리
            },
            data: {
                key: key,
            },
        }).done(function() {
            location.reload(); // 200이 수신되면 새로고침
        }).fail(function(xhr, err) { // 기타 응답이 수신되면 오류 처리
            console.error(err);
            $frm_login_key.val('');
            window.alert('코드를 다시 확인하세요.');
        });
    }
});