/**
 * Home page controller
 */

import Templates from '../templates/Templates.js';
import Photographer from '../models/Photographer.js';
import mediaFactory from '../models/mediaFactory.js';
import Modal from '../plugins/Modal.js';
import Listbox from '../plugins/Listbox.js';
import Lightbox from '../plugins/Lightbox.js';

export default {
    /**
     * Photographer
     * @prop {Photographer} photographer 
     */

    photographer: undefined,
    /**
     * Filtered media
     * @prop {Array<Media>} filteredMedia 
     */
    filteredMedia: [],

    /**
     * Preloaded images
     * @prop {Array.<HTMLImageElement>} preloadedImages 
     */
    preloadedImages: [],

    /**
     * Photographer id
     * @prop 
     */
    stateId: undefined,

    /**
     * Likes
     * @prop 
     */
    stateLikes: [],

    /**
     * Default filter order
     * @prop 
     */
    stateOrder: 'rate',

    /**
     * Templates
     * @prop {string} api 
     */
    templates: {
        photographer: '',
        tag: '',
        media: '',
    },

    /**
     * Dom
     * @prop {object} dom 
     */
    dom: {
        photographer: document.getElementById('photographer'),
        modal: document.getElementById('modal-contact'),
        contact: document.forms["contact"],
        filter: document.getElementById('filter'),
        media: document.getElementById('media'),
        lightbox: document.getElementById('lightbox'),
    },

    /**
     * Api url
     * @prop {string>} api 
     */
    api: './api/FishEyeData.json',

    /**
     * Mount controller
     * @return {void}
     */
    async mount () {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        await this.fetchData(id);
        if (!this.photographer) return window.location.replace("index.html");// Redirect to homepage (or 404 page)
        this.stateId = id;
        this.applyFilter();
        this.render();
    },

    /**
     * Preload image and render content
     * @return {void}
     */
    async render () {
        this.preloadImages();
        await Templates.load(['PhotographerHeader', 'MediaCard']);
        this.renderPhotographer();
        this.lightbox = new Lightbox();
        this.renderMedia();
        this.filter = new Listbox(this.dom.filter);
        this.filter.onChange((order) => {
            if (this.stateOrder ==  order) return;
            this.stateOrder =  order;
            this.applyFilter();
            this.renderMedia();
        });
    },

    /**
     * Render photographer
     * @returns {void}
     */
    renderPhotographer () {
        // Header
        this.dom.photographer.innerHTML = '';// Clean photographer
        const template = Templates.getPhotographerHeader(this.photographer);
        this.dom.photographer.innerHTML = template;
        this.dom.photographer.querySelectorAll('[data-filter]').forEach(// Bind tag
            (el) => el.addEventListener('click', 
                (e) => window.location.replace("index.html?tag=" + el.dataset.filter)
            )
        );
        // Likes
        this.updateLikes();
        // Modal
        this.modal = new Modal(this.dom.modal, {});
        const buttonContact = this.dom.photographer.querySelector('[href="#modal-contact"]');
        this.modal.bindOpen(buttonContact);
        this.dom.modal.querySelector('[data-modal-name]').innerText = this.photographer.firstname;
        this.dom.contact.addEventListener('submit', this.submitContact.bind(this));
    },

    /**
     * Render media
     * @returns {void}
     */
    renderMedia () {
        this.dom.media.innerHTML = '';// Clean media
        this.filtredMedia.forEach(// Format and inject media
            (media) => this.dom.media.innerHTML += Templates.getMediaCard(media)
        );
        // Lightbox
        this.lightbox.setMedia(this.dom.media);
        // Likes
        this.dom.media.querySelectorAll('[data-likes]').forEach(
            (el) => {
                el.setAttribute('tabindex', 0);
                el.addEventListener('click', (e) => this.toggleLike(el));
            }
        );
    },

    /**
     * 
     * @async
     * @returns {Promise<Array>}
     */
    async fetchData (id) {
        try {
            const response = await fetch(this.api);
            const responseData = await response.json();
            this.photographers = [];
            responseData.photographers.forEach(
                (photographer) => {
                    if (photographer.id == id)
                        this.photographer = new Photographer(photographer);
                }
            );
            responseData.media.forEach(
                (media) => {
                    if (this.photographer && media.photographerId == id)
                        this.photographer.media.push(mediaFactory(media));
                }
            );
            return responseData;
        }
        catch (error) {
            console.log(error);
        }
    },

    /**
     * Toggle media likes
     * @param {HTMLElement} elLike
     * @returns {void}
     */
    toggleLike (elLike) {
        const id = elLike.dataset.likes;
        let likes;
        if (this.stateLikes.includes(id)) {// Remove like
            this.stateLikes.splice(this.stateLikes.indexOf(id), 1);
            likes = --this.photographer.media.find((media) => media.id == id).likes;
        }
        else {// Add like
            this.stateLikes.push(id);
            likes = ++this.photographer.media.find((media) => media.id == id).likes;
        }
        elLike.querySelector('[data-likes-count]').innerText = likes;
        this.updateLikes();
    },

    /**
     * Update likes counter
     * @returns {void}
     */
    updateLikes () {
        let likes = 0;
        this.photographer.media.forEach((media) => likes += media.likes)
        this.dom.photographer.querySelector('[data-likes-count]').innerText = likes;
    },

    /**
     * Submit contact form
     * @param {SubmitEvent} e
     * @returns {void}
     */
    submitContact (e) {
        e.preventDefault();
        const form = {
            firstname: this.dom.contact.querySelector('input[name="firstname"]'),
            lastname: this.dom.contact.querySelector('input[name="lastname"]'),
            email: this.dom.contact.querySelector('input[name="email"]'),
            message: this.dom.contact.querySelector('textarea[name="message"]'),
        };
        let color = 'red';
        let validContact = this.validContact(form);
        if (validContact) color = 'green';
        console.log('%cFormulaire de contact:', 'color: '+ color +'; font-size: large;  font-weight: bold');
        console.log('%cPrénom: ' + form.firstname.value, 'color: '+ color +';');
        console.log('%cNom: ' + form.lastname.value, 'color: '+ color +';');
        console.log('%cEmail: ' + form.email.value, 'color: '+ color +';');
        console.log('%cMessage: ' + form.message.value, 'color: '+ color +';');
        this.dom.modal.click();
    },

    /**
     * Valid contact form
     * @param {object} form
     * @param {HTMLElement} form.firstname
     * @param {HTMLElement} form.lastname
     * @param {HTMLElement} form.email
     * @param {HTMLElement} form.message
     * @returns {boolean}
     */
    validContact (form) {
        let formErrors = 0;

        const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$/;// european convention 
        if (!form.firstname.value.trim().match(nameRegex)) {
            formErrors++;
            this.showContactError(form.firstname);
        } else this.hideContactError(form.firstname);

        if (!form.lastname.value.trim().match(nameRegex)) {
            formErrors++;
            this.showContactError(form.lastname);
        } else this.hideContactError(form.lastname);

        const mailRegex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;// RFC2822
        if (!form.email.value.match(mailRegex)) {
            formErrors++;
            this.showContactError(form.email);
        } else this.hideContactError(form.email);

        if (!form.message.value.trim().length > 4) {
            formErrors++;
            this.showContactError(form.message);
        } else this.hideContactError(form.message);

        return formErrors === 0;
    },

    /**
     * Show contact error
     * @param {HTMLElement} el
     */
    showContactError (el) {
        el.closest('[data-error]').dataset.errorShow = 'true';
    },

    /**
     * Hide contact error
     * @param {HTMLElement} el
     */
    hideContactError (el) {
        delete el.closest('[data-error]').dataset.errorShow;
    },

    /**
     * Apply data filtered
     * @returns {Array.<Media>}
     */
    applyFilter () {
        let filtered = this.photographer.media;
        filtered = this.applyOrderByTitle(filtered);
        if (this.stateOrder == 'likes') filtered = this.applyOrderByLikes(filtered);
        else if (this.stateOrder == 'date') filtered = this.applyOrderByDate(filtered);
        return this.filtredMedia = filtered;
    },

    /**
     * Order by title
     * @param {Array.<Media>} media
     * @param {string} order asc | desc
     * @returns {Array.<Media>}
     */
    applyOrderByTitle (media, order = 'asc') {
        if (order == 'desc') return media.sort((a, b) => a.title < b.title ? 0 : -1);
        else return media.sort((a, b) => a.title < b.title ? -1 : 0);
    },

    /**
     * Order by date
     * @param {Array.<Media>} media
     * @param {string} order asc | desc
     * @returns {Array.<Media>}
     */
    applyOrderByDate (media, order = 'asc') {
        if (order == 'desc') return media.sort((a, b) => new Date(a.date) - new Date(b.date));
        else return media.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    /**
     * Order by likes
     * @param {Array.<Media>} media
     * @param {string} order asc | desc
     * @returns {Array.<Media>}
     */
    applyOrderByLikes (media, order = 'asc') {
        if (order == 'desc') return media.sort((a, b) =>  a.likes - b.likes);
        else return media.sort((a, b) => b.likes - a.likes);
    },

    /**
     * Preload photographers images
     * @returns {void}
     */
    preloadImages () {
        let image = new Image();
        image.src = `assets/images/photographers/${this.photographer.id}/${this.photographer.portrait}`;
        this.preloadedImages.push(image);
        this.photographer.media.forEach((media) => {
            if (media.type != 'image') return;
            let image = new Image();
            image.src = `assets/images/photographers/${this.photographer.id}/media/${media.image}`;
            this.preloadedImages.push(image);
        });
    },
}