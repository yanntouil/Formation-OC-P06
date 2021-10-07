



/**
 * Lock body scroll
 * @returns {void}
 */
export function lockBodyScroll () {
    document.body.style.width = document.body.clientWidth + 'px';// Scrollbar
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
}

/**
 * Unlock body scroll
 * @returns {void}
 */
export function unlockBodyScroll () {
    document.body.style.width = '';
    document.body.style.position = '';
    document.body.style.overflow = '';
}