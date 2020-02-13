const {
    Router
} = require('express');
const Order = require('../models/order');
const router = Router();

const authMiddleware = require('../middleware/auth');

router.get('/',authMiddleware, async (req, res) => {
try{
    const orders =  await Order.find({
        'user.userId':req.user._id
    })
    .populate('user.userId');

    res.render('orders', {
        isOrder: true,
        title: 'Orders',
        orders: orders.map(o=>{
            return {
                ...o._doc,
                price: o.tours.reduce((total, c)=>{
                    return total += c.count * c.tour.price;
                },0)
            };
        })
    });
}catch(e){
    console.log(e);
}
    
});

router.post('/', authMiddleware,async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.toursId')
            .execPopulate();
        const tours = user.cart.items.map(i => ({
            count: i.count,
            tour: {
                ...i.toursId._doc
            }
        }));
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            tours: tours
        });

        await order.save();
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (e) {
        console.log(e);

    }

});

module.exports = router;