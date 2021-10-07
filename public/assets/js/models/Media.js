/**
 * Class media
 */






 export default class Media {
    constructor(data) {
        this.id = data.id;
        this.photographer = {id: data.photographerId};
        this.title = data.title;
        this.tags = data.tags;
        this.alt = data.alt;
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
        this.type = 'media';
    }
}
