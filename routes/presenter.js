const fs = require('fs');
const router = require('express').Router();

router.get('/', (req, res) => {
    let viewFile = fs.readFileSync(__dirname + '/../view/presenter_dashboard.html')

    if (!req.session.isAuthed) {
        viewFile = fs.readFileSync(__dirname + '/../view/presenter_login.html');

        const key = ('0000' + Math.floor(Math.random() * 10000)).substr(-4);
        console.log('Login Key:', key);
        req.session.key = key;
    }

    const view = viewFile.toString();
    res.send(view);
    return;
});

router.post('/', (req, res) => {
    const key = req.body.key;

    if (key === req.session.key) {
        req.session.isAuthed = 'true';
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;