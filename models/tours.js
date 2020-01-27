const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');

class Tour {
    constructor(title, price, img) {
        this.title = title,
            this.price = price,
            this.img = img,
            this.id = uuid()
    }
    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        };
    }
    static async update(tour){
        const tours = await Tour.getAll();
        const idx = tours.findIndex(x => x.id === tour.id);
        tours[idx] = tour;

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'tours.json'), JSON.stringify(tours),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    }

    async save() {
        const tours = await Tour.getAll();
        tours.push(this.toJSON());

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'tours.json'), JSON.stringify(tours),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    }
    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'tours.json'), 'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(content));
                    }
                });
        });
    }
    static async getById(id) {
        const tours = await Tour.getAll();
        return tours.find(c => c.id === id);
    }

}

module.exports = Tour;