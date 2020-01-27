const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expHBS = require('express-handlebars');
const routerIndex = require('./router/index');
const routerAdd = require('./router/add');
const routerCard = require('./router/card');
const routerTours = require('./router/tours');

const app = express();

const hbs = expHBS.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

app.use('/',routerIndex);
app.use('/add',routerAdd);
app.use('/tours',routerTours);
app.use('/card',routerCard);


const PORT = process.env.PORT || 8000;

async function start(){
  try{
    const connectionDB = 'mongodb+srv://admin:C0Jij74gh4xNsQ9U@testfirstshop-rglig.mongodb.net/test?retryWrites=true&w=majority';
    await mongoose.connect(connectionDB,{
      useNewUrlParser:"true",
      useUnifiedTopology: true});
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch(e){
    console.log(e);
  }
}
start();


// FOR MongoDB
// const user = admin;