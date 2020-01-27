const {
    Router
} = require('express');
const Card = require('../models/card');
const Tours = require('../models/tours');
const router = Router();

router.post('/add', async (req, res) => {
    const tour = await Tours.getById(req.body.id);
    await Card.add(tour);
    res.redirect('/card');
});

router.delete("/remove/:id", async (req,res)=>{
    const card = await Card.remove(req.params.id);
    res.status(200).json(card);
});

router.get('/', async (req, res) => {
    const card = await Card.fetch();
    res.render('card', {
        title: 'Card',
        isCard: true,
        tours: card.tours,
        price: card.price
    });
});

module.exports = router;