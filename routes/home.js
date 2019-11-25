var express = require('express');
var router = express.Router();
var {Tobacco} = require('../models');

router.get('/', async (req, res) => {
    var tobacco_list = await Tobacco.findAll();
    let session = req.session;

var best_tobacco = [];

function compareTobacco(tobacco1, tobacco2) {
    return tobacco1.score - tobacco2.score;
}

for(var i =0; i < tobacco_list.length; ++i) {
    best_tobacco.push(tobacco_list[i]);
}

best_tobacco.sort(compareTobacco);
best_tobacco.reverse();
console.log('best tobacco?');
console.log(best_tobacco[0]);


    res.render('home.ejs', {'tobacco_list':best_tobacco, "session":session});
});

module.exports = router;