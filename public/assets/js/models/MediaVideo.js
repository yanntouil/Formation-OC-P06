/**
 * Class Photographer
 */






import Media from './Media.js';

export default class MediaVideo extends Media  {
     constructor(data) {
         super(data);
         this.video = data.video;
         this.type = 'video';
     }
    static get template () {
        return 'MediaVideo.html'
    };
} 