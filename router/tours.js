const {
    Router
} = require('express');
const Tour = require('../models/tours');
const router = Router();


router.get('/', async (req, res) => {
 /*   const tours = await Tour.find()
        .populate('userId', 'email name')
        .select('price title img');
    console.log(tours);
*/

    const tours = await Tour.find();
    res.render('tours', {
        title: 'Tours',
        isTours: true,
        tours
    });
});

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    const tour = await Tour.findById(req.params.id);
    res.render('tour-edit', {
        title: `Edit ${tour.title}`,
        tour
    });
});

router.post('/edit', async (req, res) => {
    const {
        id
    } = req.body;
    delete req.body.id;
    await Tour.findByIdAndUpdate(id, req.body);
    res.redirect('/tours');
});

router.post('/remove', async (req, res) => {
    try {
        await Tour.deleteOne({
            _id: req.body.id
        });
        res.redirect('/tours');
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id', async (req, res) => {
    const tour = await Tour.findById(req.params.id);
    res.render('tour', {
        layout: 'empty',
        title: `Tour ${tour.title}`,
        tour
    });
});

module.exports = router;