








export default {
    /**
     * Template
     * @prop {object} template
     */
    templates: {
        PhotographerHeader: '',
        PhotographerCard: '',
        MediaCard: '',
        MediaImage: '',
        MediaVideo: '',
        Tag: '',
    },

    /**
     * Return formated photographer header
     * @param {Photographer} photographer
     * @returns {string}
     */
    getPhotographerHeader (photographer) {
        // Get formated tags
        let elTags = '';
        photographer.tags.forEach(
            (tag) => elTags += this.getTag(tag)
        );
        
        // Replace name, city, country, tagline, price, id and tags
        let elPhotographer = this.templates.PhotographerHeader
            .replace(/{{name}}/gi, photographer.firstname)
            .replace(/{{city}}/gi, photographer.city)
            .replace(/{{country}}/gi, photographer.country)
            .replace(/{{tagline}}/gi, photographer.tagline)
            .replace(/{{price}}/gi, photographer.price)
            .replace(/{{image}}/gi, `assets/images/photographers/${photographer.id}/${photographer.portrait}`)
            .replace(/{{id}}/gi, `photographer${photographer.id}`)
            .replace(/{{tags}}/gi, elTags);

        // Return formated string
        return elPhotographer;
    },

    /**
     * Return formated photographer card
     * @param {Photographer} photographer
     * @param {Array} stateTags
     * @returns {string}
     */
    getPhotographerCard (photographer, stateTags = []) {
        // Get formated tags
        let elTags = '';
        photographer.tags.forEach(
            (tag) => elTags += this.getTag(tag, stateTags.includes(tag))
        );
        
        // Replace name, city, country, tagline, price, id and tags
        let elPhotographer = this.templates.PhotographerCard
            .replace(/{{name}}/gi, photographer.name)
            .replace(/{{city}}/gi, photographer.city)
            .replace(/{{country}}/gi, photographer.country)
            .replace(/{{tagline}}/gi, photographer.tagline)
            .replace(/{{price}}/gi, photographer.price)
            .replace(/{{image}}/gi, `assets/images/photographers/${photographer.id}/${photographer.portrait}`)
            .replace(/{{id}}/gi, `${photographer.id}`)
            .replace(/{{tags}}/gi, elTags);

        // Return formated string
        return elPhotographer;
    },

    /**
     * Return formated tag
     * @param {string} tag
     * @param {boolean} state
     * @returns {string} Formated tag template
     */
    getTag (tag, state = false) {
        let elString = this.templates.Tag.replace(/{{name}}/gi, tag);
        if (state) elString = elString.replace(/{{state}}/gi, 'true');
        else elString = elString.replace(/{{state}}/gi, 'false');
        return elString;
    },

    /**
     * Return formated media
     * @param {Media} media
     * @returns {string} Formated media template
     */
    getMediaCard (media) {
        let elMedia = '';
        if (media.type == 'image') elMedia = this.getMediaImage(media);
        else if (media.type == 'video') elMedia = this.getMediaVideo(media);
        else elMedia = '';

        let elString = this.templates.MediaCard
            .replace(/{{id}}/gi, media.id)
            .replace(/{{title}}/gi, media.title)
            .replace(/{{likes}}/gi, media.likes)
            .replace(/{{media}}/gi, elMedia);
        return elString;
    },

    /**
     * Return formated image
     * @param {Media} media
     * @returns {string} Formated media template
     */
     getMediaImage (media) {
        let elString = this.templates.MediaImage
            .replace(/{{image}}/gi, `assets/images/photographers/${media.photographer.id}/media/${media.image}`)
            .replace(/{{title}}/gi, media.title)
            .replace(/{{alt}}/gi, media.alt);
        return elString;
    },

    /**
     * Return formated video
     * @param {Media} media
     * @returns {string} Formated media template
     */
    getMediaVideo (media) {
        let elString = this.templates.MediaVideo
            .replace(/{{video}}/gi, `assets/images/photographers/${media.photographer.id}/media/${media.video}`)
            .replace(/{{title}}/gi, media.title)
            .replace(/{{alt}}/gi, media.alt);
        return elString;
    },
    
    /**
     * Load a templates list
     * @param {Array<string>} templates
     * @returns {Promise}
     */
    async load (templates) {
        // Add dependencies
        if (templates.includes('PhotographerHeader') && !templates.includes('Tag')) templates.push('Tag');
        if (templates.includes('PhotographerCard') && !templates.includes('Tag')) templates.push('Tag');
        if (templates.includes('MediaCard') && !templates.includes('MediaImage')) templates.push('MediaImage');
        if (templates.includes('MediaCard') && !templates.includes('MediaVideo')) templates.push('MediaVideo');
        // Fetch templates
        const promises = [];
        templates.forEach((template) => {
            const templateUrl = new URL('./' + template + '.html', import.meta.url).href;
            const promise = fetch(templateUrl)
                .then((response) => response.text())
                .then((responseText) => {
                    this.templates[template] = responseText;
                });
            promises.push(promise)
        });
        // Return promise
        return Promise.all(promises);
    }
}