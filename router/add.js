const { Router } = require('express');
const Tour = require('../models/tours');
const {toursValidators} = require('../utils/validators');
const {validationResult} = require('express-validator');
const router = Router();
const authMiddleware = require('../middleware/auth');

router.get('/',authMiddleware, (req, res) => {
  res.render('add', {
    title: 'Add tour',
    isAdd: true
  });
});

router.post('/',authMiddleware, toursValidators, async(req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422)
    .render('add',{
      title: 'Add tour',
      isAdd: true,
      error:errors.array()[0].msg,
      data:{
        title: req.body.title, 
        price: req.body.price, 
        img: req.body.img
      }
    });
  }

  const tour = new Tour({
     title: req.body.title, 
     price: req.body.price, 
     img: req.body.img,
     userId: req.user
    }
     );

  try{
    await tour.save();
    res.redirect('/tours');
  }catch(e){
    console.log(err);    
  }
  
});

module.exports = router;
