var express = require('express');
var router = express.Router();
var {Tobacco} = require('../models');
var {Review} = require('../models');

//detail
router.get('/detail/:id', async (req, res) => {
    var tobacco_id = req.params.id;
    var reviews = [];

    // 해당 구름과자의 타격감 및 별점 계산
    var hit = {'상':0,'중':0,'하':0};
    var hit_value;
    var score = 0;

    var tobacco_info = await Tobacco.findOne({
        where : {tobacco_id : tobacco_id}
    }).catch((err) =>{
        console.log(err);
    });
    var review_list = await tobacco_info.getReviews();

    if(review_list.length != 0) {
        for(var i = 0;  i < review_list.length; ++i) {
            score += review_list[i].score;
            switch(review_list[i].feel_of_hit) {
                case '상':
                    hit['상'] += 1;
                    break;
                case '중':
                    hit['중'] += 1;
                    break;
                case '하':
                    hit['하'] += 1;
                    break;    
            }
        }

        score = score / review_list.length;
        var max_val=0;
        if(max_val <= hit['상']) {
            max_val = hit['상'];
            hit_value = '상';
        }
        if(max_val <= hit['중']) {
            max_val = hit['중'];
            hit_value = '중';
        }
        if(max_val <= hit['하']) {
            max_val = hit['하'];
            hit_value = '하';
        }

        try{
            await Tobacco.update({
                 feel_of_hit : hit_value,
                 score : score,
                
            }, {
                where : {tobacco_id: tobacco_id}
            });
        } catch(err) {
            console.log(err);
        }
    }

    //해당 구름과자 상세정보 가져옴
    var tobacco_info = await Tobacco.findOne({
        where : {tobacco_id : tobacco_id}
    }).catch((err) =>{
        console.log(err);
    });
    

    //해당 음식점의 리뷰를 가져옴.
    var review_info = await tobacco_info.getReviews();

    for(var i = 0; i < review_info.length; i++) {
        var info = {
            writer : review_info[i].dataValues.writer,
            comment : review_info[i].dataValues.comment,
            feel_of_hit : review_info[i].dataValues.feel_of_hit,
            score : review_info[i].dataValues.score
        };
        reviews.push(info);
    }

    

    res.render('./tobacco/detail.ejs', {'tobacco_info': tobacco_info, 'reviews':reviews});
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


//review create
router.post("/detail/:id/create_review", async function(req, res){
    var tobacco_id= req.params.id;
    var review_data = req.body;
    await Review.create({
        writer : review_data.review_writer,
        feel_of_hit : review_data.review_feel_of_hit,
        score : review_data.review_score,
        comment : review_data.review_comment,
    }).then(async function(review_info) {
        await Tobacco.findOne({
            where: {tobacco_id:tobacco_id}
        }).then( async function(rest){
            console.log(review_info);
            await rest.addReview(review_info)
        });
    }).catch(function(err){
        console.log(err);
    });



    

    res.redirect('/tobacco/detail/'+tobacco_id);
});

module.exports = router;