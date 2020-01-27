const path = require('path');
const fs = require("fs");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "card.json"
);

class Card{

    static async add(tour){
        const card = await Card.fetch();

        const idx = card.tours.findIndex(c => c.id===tour.id);
        const candidate = card.tours[idx];
        if(candidate){
            candidate.count++;
            card.tours[idx] = candidate;
        }else{
            tour.count = 1;
            card.tours.push(tour);
        }
        card.price += +tour.price;

        return new Promise((resolve,reject)=>{
            fs.writeFile(p,JSON.stringify(card),err=>{
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    }

    static async remove(id){
        const card = await Card.fetch();

        const idx = card.tours.findIndex(c => c.id === id);
        const tour = card.tours[idx];

        if(tour.count === 1){
            card.tours = card.tours.filter(c=> c.id !== id)
        }else{
            card.tours[idx].count--;    
        }
        card.price -= tour.price;

        return new Promise((resolve,reject)=>{
            fs.writeFile(p,JSON.stringify(card),err=>{
                if(err){
                    reject(err);
                }else{
                    resolve(card);
                }
            });
        });
    }

    static async fetch(){
        return new Promise((resolve, reject)=>{
            fs.readFile(p,"utf-8",(err,content)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(JSON.parse(content));
                }
            });
        });
    }
}

module.exports = Card;