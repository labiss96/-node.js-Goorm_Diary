var express = require('express');
var router = express.Router();
var {Tobacco} = require('../models');

router.get('/', async (req, res) => {
    var tobacco_list = await Tobacco.findAll();
    let session = req.session;
    res.render('home.ejs', {'tobacco_list':tobacco_list, "session":session});
});

module.exports = router;