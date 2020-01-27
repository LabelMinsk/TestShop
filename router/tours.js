const {
    Router
} = require('express');
const Tour = require('../models/tours');
const router = Router();

router.get('/', async (req, res) => {
    const tours = await Tour.getAll();
    res.render('tours', {
        title: 'Tours',
        isTours: true,
        tours
    });
});

router.get('/:id/edit', async(req,res)=>{
    if(!req.query.allow){
        return res.redirect('/');
    }

    const tour = await Tour.getById(req.params.id);
    res.render('tour-edit',{
        title:`Edit ${tour.title}`,
        tour
    });
});

router.post('/edit', async (req,res)=>{
    const tour = Tour.update(req.body);
    res.redirect('/tours');
});

router.get('/:id', async (req, res) => {
    const tour = await Tour.getById(req.params.id);
    res.render('tour', {
        layout:'empty',
        title: `Tour ${tour.title}`,
        tour
    });
});

module.exports = router;