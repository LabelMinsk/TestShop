const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const expHBS = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const routerIndex = require('./router/index');
const routerAdd = require('./router/add');
const routerCard = require('./router/card');
const routerTours = require('./router/tours');
const routerOrders = require('./router/orders');
const routerAuth = require('./router/auth');
const routerProfile = require('./router/profile');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleWare = require('./middleware/file');
const keys = require('./keys');



const app = express();

const hbs = expHBS.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
});

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.connection_DB
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store //store:store
}));
app.use(fileMiddleWare.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());

app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', routerIndex);
app.use('/add', routerAdd);
app.use('/tours', routerTours);
app.use('/card', routerCard);
app.use('/orders', routerOrders);
app.use('/auth', routerAuth);
app.use('/profile',routerProfile);

app.use(errorHandler);


const PORT = process.env.PORT || 8000;

async function start() {
  try {

    await mongoose.connect(keys.connection_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (e) {
    console.log(e);
  }
}
start();

// FOR MongoDB
// const user = admin; id = 5e2ec1a3f979bc07cca4dba0  || tvujqosT31ttUfCI