const {Router} = require('express');
const User = require('../models/user');
const routerAuth = Router();

routerAuth.get('/login', async (req,res)=>{
    res.render('auth/login',{
        title:'Authentication',
        isLogin: true
    });
});

routerAuth.get('/logout', async (req,res)=>{
    //req.session.isAuthenticated = false;
    req.session.destroy(()=>{
        res.redirect('/auth/login#login');
    });
});

routerAuth.post('/login',async(req,res)=>{
    const user = await User.findById('5e2ec1a3f979bc07cca4dba0');
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save((err)=>{
        if(err){
            throw err;
        }
        res.redirect('/');
    });
});

routerAuth.post('/register',async(req,res)=>{

});

module.exports = routerAuth;