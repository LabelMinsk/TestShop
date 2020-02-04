const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expHBS = require('express-handlebars');
const session = require('express-session');
const routerIndex = require('./router/index');
const routerAdd = require('./router/add');
const routerCard = require('./router/card');
const routerTours = require('./router/tours');
const routerOrders = require('./router/orders');
const routerAuth =require('./router/auth');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');

const app = express();

const hbs = expHBS.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
/*
app.use(async(req,res,next)=>{
  try{
    const user = await User.findById('5e2ec1a3f979bc07cca4dba0');
    req.user = user;
    
    next();
  }catch(e){
    console.log(e);
  }
});*/

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret:'some secret value',
  resave: false,
  saveUninitialized: false
}));
app.use(varMiddleware);

app.use('/',routerIndex);
app.use('/add',routerAdd);
app.use('/tours',routerTours);
app.use('/card',routerCard);
app.use('/orders',routerOrders);
app.use('/auth',routerAuth);


const PORT = process.env.PORT || 8000;

async function start(){
  try{
    const connectionDB = 'mongodb+srv://admin:C0Jij74gh4xNsQ9U@testfirstshop-rglig.mongodb.net/testfirstshop';
    await mongoose.connect(connectionDB,{
      useNewUrlParser:"true",
      useUnifiedTopology: true,
      useFindAndModify:false});

   /* const candidate = await User.findOne();
    if(!candidate){
      const user = new User({
        email:'karnoumikhail@gmail.com',
        name:'Mikhail',
        cart:{items: []}
      });
      await user.save();
    }*/

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch(e){ 
    console.log(e);
  }
}
start();


// FOR MongoDB
// const user = admin; id = 5e2ec1a3f979bc07cca4dba0