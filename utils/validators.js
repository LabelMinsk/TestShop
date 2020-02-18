const {
    check
} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    check('email')
        .isEmail()
        .withMessage('Your email is unvalid')
        .custom(async(value,{req})=>{
            try{
                const user = await User.findOne({email:value});
                if(user){
                    return Promise.reject('This email has been exist');
                }
            }catch(e){
                console.log(e);
            }
        })
        .normalizeEmail(),
    check('password','Your password be characters 3-56')
        .isLength({min:3,max:56})
        .isAlphanumeric()
        .trim(),

        check('confirm')
        .custom((value,{req})=>{
            if(value !== req.body.password){
                throw new Error('Passwords is not similar');
            }
            return true;
        })
        .trim(),
    check('name')
        .isLength({min:3})
        .withMessage('Your name be characters min 3')
        .trim()
];


exports.toursValidators = [
    check('title')
        .isLength({min:3})
        .withMessage('Min length title 3 characters')
        .trim(),
    check('price')
        .isNumeric()
        .withMessage('Enter number'),
    check('img','Enter URL')
        .isURL()
];