((document) => {
    const ipc = require('electron').ipcRenderer;
    const debounce = require('lodash.debounce');

    const notify = debounce(() => {
        ipc.sendToHost('INBOX_CHANGE');
    }, 1000, {
        'leading': true,
        'trailing': false
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' ||
                (mutation.attributeName === 'class' && mutation.target.hasAttribute('email')) ||
                (Array.from(mutation.addedNodes).some((node) => node.classList.contains('scroll-list-item')))
            ) {
                notify();
            };
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.querySelector('[role=application]'), {
            childList: true,
            characterData: true,
            attributes: true,
            subtree: true
        });
    });
})(document);
