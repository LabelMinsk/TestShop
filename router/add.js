const { Router } = require('express');
const Tour = require('../models/tours');
const router = Router();

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add tour',
    isAdd: true
  });
});

router.post('/', async(req, res) => {
  const tour = new Tour(
      req.body.title, 
      req.body.price, 
      req.body.img);
  await tour.save();
  res.redirect('/tours');
});

module.exports = router;
