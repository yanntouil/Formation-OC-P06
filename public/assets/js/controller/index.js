/**
 * Home page controller
 */



import Templates from '../templates/Templates.js';
import Photographer from '../models/Photographer.js';

export default {
    /**
     * Photographers list
     * @prop {Array.<Photographer>} photographers 
     */
    photographers: [],

    /**
     * Filtered photographers list
     * @prop {Array.<Photographer>} filtredPhotographers
     */
    filtredPhotographers: [],
    
    /**
     * Filtered photographers list
     * @prop {Array.<string>} tags
     */
    get tags () {
        return ['portrait', 'art', 'fashion', 'architecture', 'travel', 'sport', 'animals', 'events'];
    },

    /**
     * Tags states
     * @prop {Array.<string>} stateTags
     */
    stateTags: [],

    /**
     * Preloaded images
     * @prop {Array.<HTMLImageElement>} preloadedImages 
     */
    preloadedImages: [],

    /**
     * 
     * @prop {object} dom 
     */
    dom: {
        header: document.querySelectorAll('header')[0],
        tags: document.getElementById('tags'),
        photographers: document.getElementById('photographers'),
    },
    /**
     * Api url
     * @prop {string>} api 
     */
    api: '../api/FishEyeData.json',

    /**
     * Templates
     * @prop {string} api 
     */
    templates: {
        photographer: '',
        tag: '',
    },

    /**
     * Mount controller
     * @return {void}
     */
    async mount () {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString);
        const tag = urlParams.get('tag');
        console.log(tag);
        if (tag) this.stateTags.push(tag);
        this.photographers = await this.fetchPhotographers();
        this.applyFilter();
        this.render();
    },

    /**
     * Preload image and render content
     * @return {void}
     */
    async render () {
        this.preloadImages();
        this.bindScroll();
        await Templates.load(['PhotographerCard', 'Tag']);
        this.renderHeaderTags();
        this.renderPhotographers();
    },

    /**
     * Render tags, inject into the dom and bind click
     * @returns {void}
     */
    renderHeaderTags () {
        this.dom.tags.innerHTML = '';// Clean tags
        this.tags.forEach(// Format and inject tags
            (tag) => this.dom.tags.innerHTML += Templates.getTag(tag, this.stateTags.includes(tag))
        );
        this.bindFilter(this.dom.tags);// Bind injected tags
    },

    /**
     * Render filtered photographers, inject into the dom and bind click on tag
     * @returns {void}
     */
    renderPhotographers () {
        this.dom.photographers.innerHTML = '';// Clean section
        this.filtredPhotographers.forEach(// Format and inject photographers
            (photographer) => this.dom.photographers.innerHTML += Templates.getPhotographerCard(photographer, this.stateTags)
        );
        this.bindFilter(this.dom.photographers);// Bind injected photographers
    },

    /**
     * Return photographers list
     * @async
     * @returns {Promise<Array>}
     */
    async fetchPhotographers () {
        try {
            const response = await fetch(this.api);
            const responseData = await response.json();
            const photographers = []
            responseData.photographers.forEach((photographer) => {
                photographers.push(new Photographer(photographer));
            });
            return photographers;
        }
        catch (error) {
            console.log(error);
        }
    },

    /**
     * Apply data filtered
     * @param {elementHTML} elementHTML
     * @returns {void}
     */
     bindScroll () {
        window.addEventListener("scroll", (e) => {
            if (window.scrollY > 80) document.body.classList.add('scroll');
            else document.body.classList.remove('scroll');
        });
    },

    /**
     * Bind filter
     * @param {elementHTML} elementHTML
     * @returns {void}
     */
    bindFilter (elementHTML) {
        elementHTML.querySelectorAll('[data-filter]').forEach(
            (el) => {
                el.addEventListener("click", (e) => this.toggleFilter(e))
                el.addEventListener("keyup", (e) => this.toggleFilter(e))
            }
        );
    },

    /**
     * Toggle filter tag
     * @param {event} e
     * @returns {void}
     */
    toggleFilter (e) {
        if (!((e.keyCode && e.keyCode == 13) || !e.keyCode)) return;// Escape not click, not enter
        let tag = e.currentTarget.dataset.filter;
        let elTags = this.dom.tags.querySelectorAll('[data-filter~="'+ tag +'"]');
        if (this.stateTags.includes(tag)) {
            this.stateTags.splice(this.stateTags.indexOf(tag), 1);
            elTags.forEach((el) => el.dataset.filterActive = 'false');
        } else {
            this.stateTags.push(tag);
            elTags.forEach((el) => el.dataset.filterActive = 'true');
        }
        this.applyFilter();
        this.renderPhotographers();
    },
   
    /**
     * Apply data filtered
     * @returns {Array.<Photographer>}
     */
    applyFilter () {
        let filtered = this.photographers;
        filtered = this.applyFilterTags(filtered);
        filtered = this.applyOrderByName(filtered);
        return this.filtredPhotographers = filtered;
    },

    /**
     * Filter by tagsActive
     * @param {Array.<Photographer>} photographers
     * @returns {Array.<Photographer>}
     */
     applyFilterTags (photographers) {
        if (this.stateTags.length == 0) return photographers;
        let filtered = photographers;
        this.stateTags.forEach(
            tag => {
                filtered = filtered.filter(
                    photographer => photographer.tags.includes(tag)
                );
            }
        );
        return filtered;
    },

    /**
     * Order by name
     * @param {Array.<Photographer>} photographers
     * @returns {Array.<Photographer>}
     */
    applyOrderByName (photographers) {
        return photographers.sort(
            (a, b) => a.name < b.name ? -1 : 0
        );
    },

    /**
     * Preload images
     * @returns {void}
     */
    preloadImages () {
        this.photographers.forEach((photographer) => {
            let image = new Image();
            image.src = `assets/images/photographers/${photographer.id}/${photographer.portrait}`;
            this.preloadedImages.push(image);
        });
    },
};