const { Router } = require('express');
const Tour = require('../models/tours');
const router = Router();
const authMiddleware = require('../middleware/auth');

router.get('/',authMiddleware, (req, res) => {
  res.render('add', {
    title: 'Add tour',
    isAdd: true
  });
});

router.post('/',authMiddleware, async(req, res) => {
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
