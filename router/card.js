const {
    Router
} = require('express');
const Tours = require('../models/tours');
const router = Router();
const authMiddleware = require('../middleware/auth');

function mapCartItems(cart){
    return cart.items.map(c=>({
        ...c.toursId._doc, 
        id: c.toursId.id,
        count:c.count
    }));
}

function computePrice(tourse){
    return tourse.reduce((total, tourse)=>{
        return total += tourse.price * tourse.count;
    },0);
}

router.post('/add',authMiddleware, async (req, res) => {
    const tour = await Tours.findById(req.body.id);
    await req.user.addToCart(tour);
    res.redirect('/card');
});

router.delete("/remove/:id",authMiddleware, async (req,res)=>{
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.toursId').execPopulate();
    const tours = mapCartItems(user.cart);
    const cart = {
       tours,
       price: computePrice(tours) 
    };
    res.status(200).json(cart);
});

router.get('/',authMiddleware, async (req, res) => {
    const user = await req.user
    .populate('cart.items.toursId')
    .execPopulate();

    const tourse = mapCartItems(user.cart);
    
    res.render('card', {
        title: 'Card',
        isCard: true,
        tours: tourse,
        price: computePrice(tourse)
    }); 
});

module.exports = router;