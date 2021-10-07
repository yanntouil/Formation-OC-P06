/**
 * Lightbox class
 */




import { lockBodyScroll, unlockBodyScroll } from "./bodyScroll.js";

export default class Lightbox {
    /**
     * @constructor
     * @param {HTMLElement} elLightbox
     * @param {Object} options
     * @param {boolean} options.lockBodyScroll
     * @param {boolean} options.keyboardInteraction
     */
    constructor(elLightbox, options = {}) {
        this.state = false;
        this.options = Object.assign({}, {
            lockBodyScroll: true,
            keyboardInteraction: true,
        }, options);
        this.init();
    }

    /**
     * Lightbox initialization
     */
    init () {
        this.buildDOM();
        this.dom = {
            media: this.lightbox.querySelector('[data-lightbox-media]'),
            caption: this.lightbox.querySelector('[data-lightbox-caption]'),
            next: this.lightbox.querySelector('[data-lightbox-next]'),
            prev: this.lightbox.querySelector('[data-lightbox-prev]'),
            close: this.lightbox.querySelector('[data-lightbox-close]'),
        }
        // Bind lightbox button
        this.dom.close.addEventListener("click", this.closeLightbox.bind(this));
        this.dom.prev.addEventListener("click", this.showPrev.bind(this));
        this.dom.next.addEventListener("click", this.showNext.bind(this));
    }

    /**
     * Set media and bind on click
     * @param {HTMLElement} elMedia 
     */
    setMedia (elMedia) {
        this.media = Array.from((elMedia).querySelectorAll('[data-lightbox]'));
        this.media.forEach((el) => {
            el.setAttribute('tabindex', 0)
            el.addEventListener('keydown', this.openLightbox.bind(this));
            el.addEventListener("click", this.openLightbox.bind(this));
        });
    }
    
    /**
     * Open lightbox
     * @param {KeyboardEvent|PointerEvent} e 
     * @returns {void}
     */
    openLightbox (e) {
        if(e instanceof KeyboardEvent && !['Enter'].includes(e.key)) return;// Click or Enter
        e.preventDefault();
        this.currentMedia = e.currentTarget;
        this.loadMedia();
        this.lightbox.style.display = '';
        this.state = true;
        if (this.options.lockBodyScroll) lockBodyScroll();
        if (this.options.keyboardInteraction) {
            this.manageKeyboardListener = this.manageKeyboard.bind(this)
            window.addEventListener('keydown', this.manageKeyboardListener);
        }
    }

    /**
     * Close lightbox
     * @param {KeyboardEvent|PointerEvent} e 
     * @returns {void}
     */
    closeLightbox (e) {
        this.dom.media.innerHTML = '';
        this.dom.caption.innerHTML = '';
        this.lightbox.style.display = 'none';
        this.state = false;
        if (this.options.lockBodyScroll) unlockBodyScroll();
        if (this.options.keyboardInteraction) {
            window.removeEventListener('keydown', this.manageKeyboardListener);
        }
    }

    /**
     * Show previous media
     */
    showPrev () {
        let index = this.media.findIndex((el) => el === this.currentMedia);
        if (--index < 0) index = this.media.length - 1;
        this.currentMedia = this.media[index];
        this.loadMedia();
    }

    /**
     * Show next media
     */
    showNext () {
        let index = this.media.findIndex((el) => el === this.currentMedia);
        if (++index >= this.media.length) index = 0;
        this.currentMedia = this.media[index];
        this.loadMedia();
    }

    /**
     * Manage keyboard interaction
     * @param {KeyboardEvent} e 
     */
    manageKeyboard (e) {
        if (!['Escape', 'Esc', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;
        if (e.key == 'ArrowLeft') return this.showPrev();
        if (e.key == 'ArrowRight') return this.showNext();
        if (['Escape', 'Esc'].includes(e.key)) return this.closeLightbox();             
    }

    /**
     * Load current media
     */
    loadMedia () {
        this.dom.media.innerHTML = '';
        const media = this.currentMedia.cloneNode(true);
        if (media instanceof HTMLVideoElement) media.setAttribute('controls','');
        this.dom.media.appendChild(media);
        this.dom.caption.innerText = media.dataset.lightboxCaption;
        
    }

    /**
     * Build and append component in body
     */
    buildDOM () {
        this.lightbox = document.createElement('aside');
        this.lightbox.classList.add('lightbox');
        this.lightbox.style.display = 'none';
        document.body.appendChild(this.lightbox);
        this.lightbox.innerHTML = `
            <div class="lightbox-wrapper" aria-label="image closeup view">
                <button class="lightbox-prev" aria-label="Précédent" data-lightbox-prev>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M231.293 473.899l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L70.393 256 251.092 74.87c4.686-4.686 4.686-12.284 0-16.971L231.293 38.1c-4.686-4.686-12.284-4.686-16.971 0L4.908 247.515c-4.686 4.686-4.686 12.284 0 16.971L214.322 473.9c4.687 4.686 12.285 4.686 16.971-.001z"/></svg>
                </button>
                <div class="lightbox-media">
                    <div class="lightbox-media-container" data-lightbox-media></div>
                    <h2 class="lightbox-media-title" data-lightbox-caption></h2>
                </div>
                <button class="lightbox-next" aria-label="Suivant" data-lightbox-next>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M24.707 38.101L4.908 57.899c-4.686 4.686-4.686 12.284 0 16.971L185.607 256 4.908 437.13c-4.686 4.686-4.686 12.284 0 16.971L24.707 473.9c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L41.678 38.101c-4.687-4.687-12.285-4.687-16.971 0z"/></svg>
                </button>
                <button class="lightbox-close" aria-label="Fermer" data-lightbox-close>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"/></svg>
                </button>
            </div>
        `;
    }
}




/*
Loader
<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
    <defs>
        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
            <stop stop-color="#fff" stop-opacity="0" offset="0%"/>
            <stop stop-color="#fff" stop-opacity=".631" offset="63.146%"/>
            <stop stop-color="#fff" offset="100%"/>
        </linearGradient>
    </defs>
    <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)">
            <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2">
                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
            </path>
            <circle fill="#fff" cx="36" cy="18" r="1">
                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
            </circle>
        </g>
    </g>
</svg>

*/