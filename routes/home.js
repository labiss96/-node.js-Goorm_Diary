var express = require('express');
var router = express.Router();
var {Tobacco} = require('../models');

router.get('/', async (req, res) => {
    var tobacco_list = await Tobacco.findAll();
    var session = req.session;

    var brand_list = tobacco_list;

    //구름 객체들을 별점을 기준으로 sorting하여 배열에 담아 context로 보냄.
    var best_tobacco = []; 
    function compareTobacco(tobacco1, tobacco2) {
        return tobacco1.score - tobacco2.score;
    }
    for(var i =0; i < tobacco_list.length; ++i) {
        best_tobacco.push(tobacco_list[i]);
    }
    best_tobacco.sort(compareTobacco);
    best_tobacco.reverse();
    best_tobacco = best_tobacco.slice(0, 4);


    res.render('home.ejs', {'tobacco_list':best_tobacco, "session":session, "brand_list":brand_list});
});

module.exports = router;