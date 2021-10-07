








import MediaImage from './MediaImage.js';
import MediaVideo from './MediaVideo.js';
import Media from './Media.js';


/**
 * Media factory
 * @param {object} data 
 * @returns {(Media|MediaImage|MediaVideo)}
 */
export default function mediaFactory (data) {
    if (data.image) return new MediaImage(data);
    else if (data.video) return new MediaVideo(data);
    else return new Media(data);
}