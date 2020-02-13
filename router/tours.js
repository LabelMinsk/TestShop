const {
    Router
} = require('express');
const Tour = require('../models/tours');
const router = Router();
const authMiddleware = require('../middleware/auth');

function isOwner(tour, req){
    return tour.userId.toString()=== req.user._id.toString();
}

router.get('/', async (req, res) => {
 /*   const tours = await Tour.find()
        .populate('userId', 'email name')
        .select('price title img');
    console.log(tours);
*/
    try{
        //const tours = await Tour.find();
        const tours = await Tour.find()
        .populate('userId', 'email name')
        .select('price title img');
        res.render('tours', {
        title: 'Tours',
        isTours: true,
        userId: req.user ? req.user._id.toString() : null,
        tours
        });
    }catch(e){
        console.log(e);
    }

    
});

router.get('/:id/edit',authMiddleware, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    try{
        const tour = await Tour.findById(req.params.id);
        if(!isOwner(tour, req)){
            return res.redirect('/tours');
        }

        res.render('tour-edit', {
            title: `Edit ${tour.title}`,
            tour
    });
    }catch(e){
        console.log(e);
    }

    
});

router.post('/edit',authMiddleware, async (req, res) => {
    try{
        const {
            id
        } = req.body;
        delete req.body.id;
        const tour = await Tour.findById(id);
        if(!isOwner(tour, req)){
            return res.redirect('/tours');
        }
        Object.assign(tour,req.body);
        await tour.save();
        //await Tour.findByIdAndUpdate(id, req.body);
        res.redirect('/tours');

    }catch(e){
        console.log(e);
    }
});

router.post('/remove',authMiddleware, async (req, res) => {
    try {
        await Tour.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        });
        res.redirect('/tours');
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id', async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id);
        res.render('tour', {
            layout: 'empty',
            title: `Tour ${tour.title}`,
            tour
    });
    }catch(e){
        console.log(e);
    }
    
});

module.exports = router;