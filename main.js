const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models').sequelize;
const cookie = require('cookie-parser');
const session = require('express-session');
const app = express();

sequelize.sync(); //DB 연결

app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); //form으로 data를 넘겨줄 bodyparser 설정.
app.use(cookie());
app.use(session({
  key: 'sid', //세션 키 값
  secret: 'secret', //세션 시크릿키, 쿠키값 변조 막기위해 암호화
  resave : false, // 세션을 항상 저장할 지 여부.
  saveUninitialize:true, //세션이 저장되기 전에 비초기화상태로 만들어 저장
  cookie: { // 쿠키 설정
    maxAge: 24000 * 60 * 60 //쿠키 유효시간은 24시간.
  }
}));

//Routes
app.use('/', require('./routes/home'));
app.use('/tobacco', require('./routes/tobacco'));
app.use('/accounts', require('./routes/accounts'));
app.use('/public/images', express.static('/images'));


//port 설정.
app.listen(3000, () => {
    console.log('app listening on port 3000!');
})