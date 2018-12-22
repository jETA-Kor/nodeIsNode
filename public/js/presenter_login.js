var $frm_login_key = $('#frm_login_key');

$frm_login_key.keyup(function() {
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
        }).done(function() {
            location.reload();
        }).fail(function(xhr, err) {
            console.error(err);
            $frm_login_key.val('');
            window.alert('코드를 다시 확인하세요.');
        });
    }
});