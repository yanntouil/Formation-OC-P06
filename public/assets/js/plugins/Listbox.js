/**
 * Listbox
 */






export default class Listbox {
    /**
     * Listbox class
     * @constructor
     * @param {HTMLElement} elListbox
     * @param {Object} options
     * @param {boolean} options.keyboardInteraction
     */
    constructor(elListbox, options = {}) {
        this.listbox = elListbox;
        this.state = false;
        this.options = Object.assign({}, {
            keyboardInteraction: true,
        }, options);

        this.init();
    }

    /**
     * Init component
     * @returns {void}
     */
    init () {
        // Dom shortcut
        this.dom = {
            label: this.listbox.querySelector('[role="label"]'),
            list: this.listbox.querySelector('[role="listbox"]'),
            options: Array.from(this.listbox.querySelectorAll('[role="option"]')),
        }
        // Listener
        this.listbox.addEventListener('click', this.openListbox.bind(this));
        const ids = [];// ids array for aria-owns
        this.dom.options.forEach(
            (option) => {
                option.addEventListener('click', (e) => {// Click on option
                    this.changeOption(option);
                    this.closeListbox();
                    e.stopPropagation();
                });
                if (option.getAttribute('aria-selected') == 'true') this.setCurrentOption(option);
                ids.push(option.getAttribute('id'));// ids array for aria-owns
            }
        );
        if (this.options.keyboardInteraction) this.listbox.addEventListener('keydown', this.manageKeyboard.bind(this));
        this.listbox.addEventListener('focusout', (e) => this.closeListbox());
        // Aria
        this.listbox.setAttribute('aria-expanded', 'false');
        this.listbox.setAttribute('aria-owns', ids.join(' '));
        this.dom.list.style.display = 'none';
    }

    /**
     * Open listbox
     * @returns {void}
     */
    openListbox () {
        if (this.state == true) return;
        this.state = true;
        this.listbox.setAttribute('aria-expanded', 'true');
        this.dom.list.style.display = '';
    }

    /**
     * Close listbox
     * @returns {void}
     */
    closeListbox () {console.log('closeListbox');
        this.state = false;
        this.listbox.setAttribute('aria-expanded', 'false');
        this.dom.list.style.display = 'none';
        if (this.changeCallback) this.changeCallback(this.currentOption.dataset.listboxValue);
    }

    /**
     * Change option
     * @param {HTMLElement} option
     * @returns {void}
     */
    changeOption (option) {console.log('change');
        this.currentOption.removeAttribute('aria-selected');
        option.setAttribute('aria-selected', 'true');
        this.setCurrentOption(option);
        this.dom.label.innerText = option.dataset.listboxName;
    }

    /**
     * Set current option
     * @param {HTMLElement} option 
     */
    setCurrentOption (option) {
        this.listbox.setAttribute('aria-activedescendant', option.getAttribute('id'));
        this.currentOption = option;
    }

    /**
     * Manage keyboard interaction event
     * @param {KeyboardEvent} e 
     * @returns {void}
     */
    manageKeyboard (e) {
        if (!['Escape', 'Esc', 'Enter', 'Home', 'End', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
        e.preventDefault();
        if (['Escape', 'Esc', 'Enter'].includes(e.key) &&  this.state == true) return this.closeListbox();
        if (['Enter', 'Home', 'End', 'ArrowDown', 'ArrowUp'].includes(e.key) &&  this.state == false) return this.openListbox();
        let index;
        if (e.key == 'Home') index = 0;// Home: go on first
        else if (e.key == 'End') index = this.dom.options.length - 1;// End: go on last
        else if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
            index = this.dom.options.findIndex((el) => el === this.currentOption);// Get current index
            if (e.key == 'ArrowUp') index--;// Previous
            else index++;// Next
            if (index >= this.dom.options.length) index = 0;// After last: go on first
            else if (index < 0) index = this.dom.options.length - 1; // Before first: go on last
        }
        return this.changeOption(this.dom.options[index]);
    }

    /**
     * On change callback
     * @param {Function} callback
     * @returns {void}
     */
    onChange (callback) {
        this.changeCallback = callback;
    }
}
