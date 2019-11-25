var express = require('express');
var router = express.Router();
var {Tobacco} = require('../models');
var {Review} = require('../models');
var {User} = require('../models');

router.get('/list', async(req, res)=> {
    var tobacco_list = await Tobacco.findAll();
    var brand_list = [];
    var collapse = [];
    var session = req.session;
    for(var i = 0; i < tobacco_list.length; ++i) {
        brand_list.push(tobacco_list[i].brand);
    }
    brands = new Set(brand_list);

    for(var m=0; m < brands.length; ++m) {
        for(var n = 0; n < tobacco_list.length; ++n) {
            if(brands[m] == tobacco_list[n].brand) {
                brands[m].push(tobacco_list[n]);
            }
        }
    }

    res.render('./tobacco/list.ejs', {'tobacco_list':tobacco_list, 'brands':brands, "session":session}); 
});

//detail
router.get('/detail/:id', async (req, res) => {
    var tobacco_id = req.params.id;
    var reviews = [];
    var session = req.session;

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
    

    //리뷰
    //var review_info = await tobacco_info.getReviews();

    var review_info = review_list;
    for(var i = 0; i < review_info.length; i++) {
        var writer_info = await User.findOne({
            where : {id : review_info[i].dataValues.writer}
        }).catch((err)=>{
            console.log(err);
        });
        var info = {
            writer : writer_info.username,
            comment : review_info[i].dataValues.comment,
            feel_of_hit : review_info[i].dataValues.feel_of_hit,
            score : review_info[i].dataValues.score
        };
        reviews.push(info);
    }

    var is_favorite = false;

    if(session.login) {
        var user = await User.findOne({
            where : {id : session.user_id}
        }).catch(function (err) {
            console.log(err);
        });
    
        var favorite_tobacco = await user.getTobaccos().catch(function (err) {
            console.log(err);
        });
    
        
        // console.log(favorite_tobacco);
        console.log(favorite_tobacco);
        
        for(i = 0; i < favorite_tobacco.length; ++i) {
            console.log("내가 좋아한 담배들 ?");
            if(favorite_tobacco[i].dataValues.tobacco_id == tobacco_id) {
                is_favorite = true;
                break;
            }
        }
        console.log(is_favorite);        
    }
    

    res.render('./tobacco/detail.ejs', {'tobacco_info': tobacco_info, 'reviews':reviews, "session":session, "is_favorite":is_favorite});
});

//create
router.get('/create', async (req, res) => {
    var tobacco_list = await Tobacco.findAll();
    var brand_list = [];
    var session = req.session;
    for(var i = 0; i < tobacco_list.length; ++i) {
        brand_list.push(tobacco_list[i].brand);
    }
    brands = new Set(brand_list);
    res.render('./tobacco/create.ejs', {'brands' : brands, "session":session}); 
});

//create_process
router.post('/create', async (req, res) => {
    var data = req.body;
    var brand;
    if (data.brand_select == "null") {
        brand = data.brand_name;
    } else {
        brand = data.brand_select;
    }
    try{
        await Tobacco.create({
            brand : brand,
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
    var session = req.session;
    var tobacco_id = req.params.id;
    var tobacco_info = await Tobacco.findOne({
        where : {tobacco_id : tobacco_id}
    }).catch((err) =>{
        console.log(err);
    })
    res.render('./tobacco/update.ejs', {'tobacco_info': tobacco_info, "session":session});
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
    var session = req.session;
    await Review.create({
        tobacco_id : tobacco_id,
        writer : session.user_id,
        feel_of_hit : review_data.review_feel_of_hit,
        score : review_data.review_score,
        comment : review_data.review_comment,
    }).then(async function(review_info) {
        await Tobacco.findOne({
            where: {tobacco_id:tobacco_id}
        }).then( async function(ciga){
            console.log(review_info);
            await ciga.addReview(review_info)
        });
    }).catch(function(err){
        console.log(err);
    });

    res.redirect('/tobacco/detail/'+tobacco_id);
});

//좋아요
router.post("/detail/:id/add_favorite", async function (req, res) {
    var tobacco_id= req.params.id;
    var session = req.session;

    var user = await User.findOne({
        where : {id : session.user_id}
    }).catch(function (err) {
        console.log(err);
    });
    var tobacco = await Tobacco.findOne({
        where : {tobacco_id:tobacco_id}
    }).catch(function(err) {
        console.log(err);
    });

    await user.addTobacco(tobacco).catch(function(err){
        console.log(err);
    });

    res.redirect('/tobacco/detail/'+tobacco_id);
});

//좋아요 삭제
router.post("/detail/:id/remove_favorite", async function (req, res) {
    var tobacco_id= req.params.id;
    var session = req.session;

    var user = await User.findOne({
        where : {id : session.user_id}
    }).catch(function (err) {
        console.log(err);
    });
    var tobacco = await Tobacco.findOne({
        where : {tobacco_id:tobacco_id}
    }).catch(function(err) {
        console.log(err);
    });

    await user.removeTobacco(tobacco).catch(function(err){
        console.log(err);
    });

    res.redirect('/tobacco/detail/'+tobacco_id);
});

router.post("/search", async function (req, res) {
    var session = req.session;
    var search_key =  req.body.search_key;
    var tobacco_list = await Tobacco.findAll().catch(function(err) {
        console.log(err);
    });
    var found = false;
    var result = [];
    for(var i =0; i < tobacco_list.length; ++i) {
        if(tobacco_list[i].name.toLowerCase().indexOf(search_key.toLowerCase()) != -1 || tobacco_list[i].brand.toLowerCase().indexOf(search_key.toLowerCase()) != -1) {
            result.push(tobacco_list[i]);
            found = true;
        }
    }

    res.render('./tobacco/search_result.ejs', {"session":session, "result":result, "search_key":search_key, "found":found});
});


module.exports = router;