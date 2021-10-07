/**
 * Modal
 */



import { lockBodyScroll, unlockBodyScroll } from "./bodyScroll.js";

export default class Modal {
    /**
     * Modal class
     * @constructor
     * @param {HTMLElement} elModal
     * @param {Object} options
     * @param {boolean} options.lockBodyScroll
     * @param {boolean} options.keyboardInteraction
     */
    constructor(elModal, options = {}) {
        this.modal = elModal;
        this.state = false;
        this.options = Object.assign({}, {
            lockBodyScroll: true,
            keyboardInteraction: true,
        }, options);

        this.init();
    }

    /**
     * Init component
     * @returns {void}
     */
    init () {
        // Listener
        this.modal.addEventListener("click", this.closeModal.bind(this));// Click on backdrop
        console.log();
        Array.from(this.modal.children).forEach(// Stop propagation on backdrop
            (el) => el.addEventListener("click", (e) => e.stopPropagation())
        );
        this.modal.querySelectorAll('[data-modal-close]').forEach(// Bind close button
            (el) => el.addEventListener("click", this.closeModal.bind(this))
        );
        // Init keyboard interaction
        if (this.options.keyboardInteraction) {
            const focusables = this.modal.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
            this.focusables = Array.from(focusables);// Get focusable elements
        }
    }

    /**
     * Open a modal
     * @param {PointerEvent} e
     * @returns {void}
     */
    openModal (e) {
        if(e.key && e.key != 'Enter') return;// Click or Enter
        e.preventDefault();
        this.state = true;
        this.modal.removeAttribute('aria-hidden');
        this.modal.setAttribute('aria-modal', 'true');
        this.modal.style.display = '';
        if (this.options.lockBodyScroll) lockBodyScroll();
        if (this.options.keyboardInteraction) {
            this.previousFocus = document.activeElement
            this.focusables[0].focus()
            this.manageKeyboardListener = this.manageKeyboard.bind(this)
            window.addEventListener('keydown', this.manageKeyboardListener);
        }
    };

    /**
     * Close modal
     * @param {KeyboardEvent|PointerEvent} e 
     * @returns {void}
     */
    closeModal (e) {
        if(e instanceof KeyboardEvent && !['Escape', 'Esc'].includes(e.key)) return;// Click or Escape
        e.preventDefault();
        this.state = false;
        this.modal.removeAttribute('aria-modal');
        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.style.display = 'none';
        if (this.options.lockBodyScroll) unlockBodyScroll();
        if (this.options.keyboardInteraction) {
            if (this.previousFocus) this.previousFocus.focus();
            window.removeEventListener('keydown', this.manageKeyboardListener);
        }
    };

    /**
     * Manage keyboard interaction event
     * @param {KeyboardEvent} e 
     * @returns {void}
     */
    manageKeyboard (e) {
        if (!['Escape', 'Esc', 'Tab'].includes(e.key)) return;
        if (e.key == 'Escape' || e.key == 'Esc') return this.closeModal (e);// Escape to close
        e.preventDefault();
        const elFocus =  this.modal.querySelector(':focus');// Get current focus
        let index = this.focusables.findIndex((el) => el === elFocus);// Get current index
        if (e.shiftKey === true) index--;// SHIFT + TAB
        else index++;// TAB
        if (index >= this.focusables.length) index = 0;// Start
        if (index < 0) index = this.focusables.length - 1;// End
        this.focusables[index].focus();
    }

    /**
     * Bind click on an element to open modal
     * @param {elementHTML} elementHTML 
     * @returns {void}
     */
    bindOpen (elementHTML) {
        this.openModalListener = this.openModal.bind(this);
        elementHTML.addEventListener("click", this.openModalListener);
    }

    /**
     * Unbind click
     * @param {elementHTML} elementHTML 
     * @returns {void}
     */
    unbindOpen (elementHTML) {
        elementHTML.removeEventListener("click", this.openModalListener);
    }
}