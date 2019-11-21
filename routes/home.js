var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    post = {
        title : 'test',
        body : 'bodyyy'
    }
    // res.send('index page');
    res.render('home.ejs', {'post': post});
});

module.exports = router;