const fs = require('fs');
const router = require('express').Router();

router.get('/', (req, res) => { // audience.html 페이지 서빙
    const viewFile = fs.readFileSync(__dirname + '/../view/audience.html');
    const view = viewFile.toString();
    res.send(view);
});

module.exports = router;