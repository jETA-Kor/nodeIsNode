const fs = require('fs');
const router = require('express').Router();

router.get('/', (req, res) => {
    let viewFile = fs.readFileSync(__dirname + '/../view/presenter_dashboard.html') // 발표자 화면을 세팅

    if (!req.session.isAuthed) { // 세션에 로그인 여부가 기록되저 있지 않다면
        viewFile = fs.readFileSync(__dirname + '/../view/presenter_login.html'); // 로그인 화면을 세팅

        const key = ('0000' + Math.floor(Math.random() * 10000)).substr(-4); // 로그인 코드를 생성 후
        console.log('Login Key:', key); // 서버 로그로 출력
        req.session.key = key; // 세션에 로그인 코드를 추가
    }

    const view = viewFile.toString();
    res.send(view); // 세팅된 화면을 서빙
});

router.post('/', (req, res) => {
    const key = req.body.key;

    if (key === req.session.key) { // 사용자가 전달한 키와 세션의 키가 일치하는 경우
        req.session.isAuthed = 'true'; // 인증 처리
        res.sendStatus(200); // 200 전달
    } else { // 불일치 하는 경우
        res.sendStatus(400); // 400 전달
    }
});

module.exports = router;