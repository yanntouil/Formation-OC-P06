/**
 * Class Photographer
 */






export default class Photographer {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.city = data.city;
        this.country = data.country;
        this.tags = data.tags;
        this.tagline = data.tagline;
        this.price = data.price;
        this.portrait = data.portrait;
        this.media = [];
    }
    get firstname() {
        return this.name.split(' ')[0];
    }
    get lastname() {
        return this.name.split(' ')[1];
    }
}
