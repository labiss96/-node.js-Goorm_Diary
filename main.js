const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models').sequelize;
const app = express();

sequelize.sync(); //DB 연결

app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); //form으로 data를 넘겨줄 bodyparser 설정.

//Routes
app.use('/', require('./routes/home'));
app.use('/tobacco', require('./routes/tobacco'));
//port 설정.
app.listen(3000, () => {
    console.log('app listening on port 3000!');
})