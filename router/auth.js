const {Router} = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult } = require('express-validator');
const nodeMailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/resetMail');
const User = require('../models/user');
const {registerValidators} = require('../utils/validators');
const routerAuth = Router();

const transporter = nodeMailer.createTransport(sendGrid({
    auth:{api_key: keys.SENDGRID_API_KEY}
}));

routerAuth.get('/login', async (req,res)=>{
    res.render('auth/login',{
        title:'Authentication',
        isLogin: true,
        loginError: req.flash("loginError"),
        regError: req.flash('regError')
    });
});

routerAuth.get('/logout', async (req,res)=>{
    //req.session.isAuthenticated = false;
    req.session.destroy(()=>{
        res.redirect('/auth/login#login');
    });
});

routerAuth.post('/login',async(req,res)=>{
    try{
        const {email, password} = req.body;
        const candidate = await User.findOne({email});

        if(candidate){
            
            const isSame = await bcrypt.compare(password, candidate.password);
            if(isSame){
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save((err)=>{
                if(err){
                    throw err;
                }
                res.redirect('/');
                });
            }else{
                req.flash('loginError','Password is wrong');
                res.redirect('/auth/login#login');
            }

        }else{
            req.flash('loginError','This user is not found');
            res.redirect('/auth/login#login');
        }
       

    }catch(e){
        console.log(e);
    }
    
});

routerAuth.post('/register',registerValidators, async(req,res)=>{
    try{
        const {email,password, name} = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            req.flash('regError',errors.array()[0].msg);
            return res.status(422)
            .redirect('/auth/login#register');
        }

        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({
            email, name, password: hashPassword, cart:{items:[]}
        });
        await user.save();
        await transporter.sendMail(regEmail(email));
        
        res.redirect('/auth/login#login');
        

    }catch(e){
        console.log(e);
    }
});

routerAuth.get('/reset', (req,res)=>{
    res.render('auth/reset',{
        title: 'Are you forget a password?',
        error: req.flash('error')
    });
});

routerAuth.get('/password/:token', async(req,res)=>{
    if(!req.params.token){
        return res.redirect('/auth/register');
    }
    try{
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp:{$gt:Date.now()}
        });
        if(!user){
            return res.redirect('/auth/login');  
        }else{
            res.render('auth/password',{
                title: 'Recover access',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            });
        }
        
    }catch(e){
        console.log(e);
    }
    
});

routerAuth.post('/reset',(req,res)=>{
    try{
        crypto.randomBytes(32,async(err,buffer)=>{
            if(err){
                req.flash('error','Something wrong, please try later');
                return res.redirect('/auth/reset');
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({email:req.body.email});
            if(candidate){
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect('/auth/login');
            }else{
                req.flash('error', 'We are not found this user!');
                res.redirect('/auth/reset');
            }
        });
    }catch(e){
        console.log(e);
    }
});

routerAuth.post('/password', async(req,res)=>{
    try{
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt:Date.now()}
        });
        if(user){
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');
        }else{
            req.flash('loginError', 'It is so long, try to start over...');
            res.redirect('/auth/login');
        }

    }catch(e){
        console.log(e);
    }
});

module.exports = routerAuth;