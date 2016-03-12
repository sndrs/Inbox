((document) => {
    const ipc = require('electron').ipcRenderer;
    const debounce = require('lodash.debounce');

    const notify = debounce(() => {
        console.log('INBOX_CHANGE');
        ipc.sendToHost('INBOX_CHANGE');
    }, 100, {
        'trailing': true
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' ||
                (mutation.attributeName === 'class' && mutation.target.hasAttribute('email')) ||
                Array.from(mutation.addedNodes).some((node) =>
                    node.classList.contains('scroll-list-item')
                )
            ) {
                console.log('notify()');
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
