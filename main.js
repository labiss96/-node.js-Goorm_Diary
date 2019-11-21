const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
// var db = mysql.createConnection({
//     host : 'localhost',
//     user: 'root',
//     password: 'coke9080!',
//     database : 'opentutorials'
// });
// db.connect();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); //__dirname -> 프로그램이 실행중인 파일의 위치를 알려주는 global 변수(현재위치).
app.use(bodyParser.json()); //form으로 data를 넘겨줄 bodyparser 설정.
app.use(bodyParser.urlencoded({extended:true}));

//Routes
app.use('/', require('./routes/home'));

app.listen(3000, () => {
    console.log('app listening on port 3000!');
})