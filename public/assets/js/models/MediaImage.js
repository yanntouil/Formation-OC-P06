/**
 * Class Photographer
 */




import Media from './Media.js';

export default class MediaImage extends Media  {
    constructor(data) {
        super(data);
        this.image = data.image;
        this.type = 'image';
    }
    static get template () {
        return 'MediaImage.html'
    };
}
