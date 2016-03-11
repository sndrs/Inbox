((document) => {
    document.addEventListener('DOMContentLoaded', () => {
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
                    (mutation.addedNodes.length && Array.from(mutation.addedNodes).some((node) =>
                        node.classList && Array.from(node.classList).some((className) =>
                            className === 'scroll-list-item'
                        )))) {
                    notify();
                };
            });
        });

        observer.observe(document.querySelector('[role=application]'), {
            childList: true,
            characterData: true,
            attributes: true,
            subtree: true
        });
    });
})(document);