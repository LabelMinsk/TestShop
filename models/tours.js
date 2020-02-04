const {Schema, model} = require('mongoose');

const tour = new Schema({
    title:{ 
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    img: String,
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

tour.method('toClient', function(){
    const tours = this.toObject();
    tours.id = tours._id;
    delete tours._id;

    return tours;
});


module.exports = model('Tour', tour);