var socket = io('/');

var $frm_msg_name = $('#frm_msg_name');
var $frm_msg_msg = $('#frm_msg_msg');
var $frm_msg_submit = $('#frm_msg_submit');
var $article = $('article');

var sendMsg = function () {
    socket.emit('chat', $frm_msg_name.val(), $frm_msg_msg.val());
    $frm_msg_msg.val('');
};
$frm_msg_submit.click(sendMsg);
$frm_msg_msg.keydown(function (e) {
    if (e.which === 13) {
        sendMsg();
    }
});

socket.on('slide', function (slide) {
    $article.fadeOut('slow');
    $article.eq(slide).fadeIn();
});

socket.on('chat', function () {
    console.log('chat?');
});

var detectOs = function () {
    var str = navigator.platform.toLowerCase();

    if (-1 < str.indexOf('mac')) {
        return 'mac';
    }
    
    if (-1 < str.indexOf('linux')) {
        return 'linux';
    }

    return 'windows';
};
var setInstaller = function () {
    var os = detectOs();
    
    var $installPrimary = $('#install_primary');
    var $installer = $('#install_' + os);

    $installPrimary.append($installer);
};
setInstaller();
