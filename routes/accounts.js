var express = require('express');
var router = express.Router();
var {User} = require('../models');
var {Tobacco} = require('../models');
router.get('/login', (req, res) => {
    let session = req.session;
    res.render('./accounts/login.ejs', {"session":session});
});

router.post('/login', async (req, res) => {
    var username = req.body.username;
    var password = req.body.pw;

    let user =  await User.findOne({
        where: {
            username : username
        }
    }).catch((err) =>{
        console.log(err);
        console.log('해당 아이디 존재하지 않음.');
        res.render('./accounts/login');
    });

    var dbPassword = user.dataValues.password;
    if(dbPassword == password){
        console.log("비밀번호 일치");
        // 세션 설정
        var session = req.session;
        session.login = true;
        session.username = username;
        session.user_id = user.dataValues.id;

        res.redirect('/');
    } else {
        console.log("비밀번호 불일치");
        res.render('./accounts/login');
    }
});

router.get('/signup', (req, res) => {
    let session = req.session;
    res.render('./accounts/signup.ejs', {"session":session});
});

router.post('/signup', (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var pw = req.body.pw;

    try{
        User.create({
            username : username,
            password : pw,
            email : email,
        });
    } catch(error) {
        console.log(error);
    }
    res.redirect('/');
});


router.get('/mypage/:username', async (req, res) => {
    var user_name = req.params.username;
    var session = req.session;
    var user_info = await User.findOne({
        where: {username : user_name}
    }).catch(function (err) {
        console.log(err);
    });

    var tobacco_list = await Tobacco.findAll().catch(function (err) {
        console.log(err);
    });

    res.render("./accounts/mypage", {"user_info" : user_info, "session" : session, "tobacco_list":tobacco_list });
});

router.post("/logout",  function(req,res){
    req.session.destroy(); //세션 제거
    res.clearCookie('sid'); // 세션을 설정한 미들웨어에서 추가된 쿠키정보 삭제.\
    res.redirect('/');
 });
// router.get('/edit/:username', (req, res) => {
//     res.render('home.ejs', {'post': post});
// });

// router.post('/edit/:username', (req, res) => {
//     res.redirect("/mypage/"+name);
// });
module.exports = router;