var express = require('express');
var router = express.Router();
var {Tobacco} = require('../models');

//detail
router.get('/detail/:id', async (req, res) => {
    var tobacco_id = req.params.id;
    
    var tobacco_info = await Tobacco.findOne({
        where : {tobacco_id : tobacco_id}
    }).catch((err) =>{
        console.log(err);
    })

    res.render('./tobacco/detail.ejs', {'tobacco_info': tobacco_info});
});

//create
router.get('/create', (req, res) => {
    res.render('./tobacco/create.ejs'); 
});

//create_process
router.post('/create', async (req, res) => {
    var data = req.body;
    try{
        await Tobacco.create({
            brand : data.brand,
            name : data.name,
            price : data.price,
            nicotine : data.nicotine,
            TAR : data.TAR,
            is_menthol : data.is_menthol
        })
    } catch(err) {
        console.log(err);
    }
    res.redirect('/');
});
//update
router.get('/update/:id', async (req, res) => {
    var tobacco_id = req.params.id;
    var tobacco_info = await Tobacco.findOne({
        where : {tobacco_id : tobacco_id}
    }).catch((err) =>{
        console.log(err);
    })
    res.render('./tobacco/update.ejs', {'tobacco_info': tobacco_info});
});
//update_process
router.post('/update/:id', async (req, res) => {
    var tobacco_id = req.params.id;
    var data = req.body;
    try{
        await Tobacco.update({
            brand : data.brand,
            name : data.name,
            price : data.price,
            nicotine : data.nicotine,
            TAR : data.TAR,
            is_menthol : data.is_menthol
        }, {
            where : {tobacco_id: tobacco_id}
        });
    } catch(err) {
        console.log(err);
    }
    res.redirect('/tobacco/detail/'+tobacco_id);
});

//delete_process
router.post('/delete/:id', async (req, res) => {
    var tobacco_id = req.params.id;
    await Tobacco.destroy({
        where : {tobacco_id : tobacco_id}
    }).catch((err) =>{
        console.log(err);
    })
    res.redirect("/");
});


module.exports = router;